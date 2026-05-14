from flask import Flask, request, jsonify, session, send_file, send_from_directory
from flask_session import Session
from flask_cors import CORS
from werkzeug.utils import secure_filename
from authlib.integrations.flask_client import OAuth
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
import os
import re
from dotenv import load_dotenv
from functools import wraps
from datetime import datetime
import io

load_dotenv()

from modules.exText import extract_text
from modules.similarity.similarity import calculate_similarity
from modules.features.exResFeats import exResFeats
from modules.features.exJobFeats import exJobFeats
from modules.features.displayResFeats import displayResFeats
from modules.features.displayJobFeats import displayJobFeats
from modules.features.compJobFeats import compJobFeats
from modules.features.compResFeats import compResFeats
from modules.similarity.reranker import rerank_resumes
from modules.ai_summary import generate_bulk_summaries

# Initialize Flask app - Points to the build folder of React
app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')

# CORS: allow React frontend to talk to this API (Local + Prod)
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:5173", os.getenv("PROD_URL", "")]}})

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

DEFAULT_WEIGHTS = {
    'experience': 0.3,
    'education': 0.2,
    'skill': 0.4,
    'language': 0.1
}

# Configure session
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
Session(app)

app.config['GOOGLE_CLIENT_ID'] = os.getenv("GOOGLE_CLIENT_ID")
app.config['GOOGLE_CLIENT_SECRET'] = os.getenv("GOOGLE_CLIENT_SECRET")
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", 'dev-secret-key')

# ========================
# DATABASE SETUP (PostgreSQL prioritized)
# ========================
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
if not app.config['SQLALCHEMY_DATABASE_URI']:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'hiresense.db')}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class HirerProfile(db.Model):
    __tablename__ = 'hirer_profiles'
    id           = db.Column(db.Integer, primary_key=True)
    google_id    = db.Column(db.String(100), unique=True, nullable=False)
    email        = db.Column(db.String(200))
    company_name = db.Column(db.String(200))
    company_size = db.Column(db.String(50))
    industry     = db.Column(db.String(100))
    location     = db.Column(db.String(200))
    website      = db.Column(db.String(200))
    your_role    = db.Column(db.String(100))
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at   = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class JobListing(db.Model):
    __tablename__ = 'job_listings'
    id           = db.Column(db.Integer, primary_key=True)
    title        = db.Column(db.String(200), nullable=False)
    job_path     = db.Column(db.String(500))
    user_id      = db.Column(db.String(100), nullable=False) # google_id
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)
    candidates   = db.relationship('SavedCandidate', backref='job', lazy=True, cascade="all, delete-orphan")

class SavedCandidate(db.Model):
    __tablename__ = 'saved_candidates'
    id           = db.Column(db.Integer, primary_key=True)
    name         = db.Column(db.String(200))
    email        = db.Column(db.String(200))
    score        = db.Column(db.Float)
    job_id       = db.Column(db.Integer, db.ForeignKey('job_listings.id'), nullable=False)
    resume_path  = db.Column(db.String(500))
    status       = db.Column(db.String(50), default='Shortlisted') # Shortlisted, Contacted, Interviewing, Rejected, Hired
    experience_match = db.Column(db.Float, default=0.0)
    education_match  = db.Column(db.Float, default=0.0)
    skill_match      = db.Column(db.Float, default=0.0)
    language_match   = db.Column(db.Float, default=0.0)
    ai_summary       = db.Column(db.Text)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

# Create all tables on startup
with app.app_context():
    db.create_all()

# ========================
# MAIL SETUP
# ========================
app.config['MAIL_SERVER']   = 'smtp.gmail.com'
app.config['MAIL_PORT']     = 587
app.config['MAIL_USE_TLS']  = True
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_DEFAULT_SENDER")
mail = Mail(app)

# Google OAuth
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=app.config['GOOGLE_CLIENT_ID'],
    client_secret=app.config['GOOGLE_CLIENT_SECRET'],
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params={'scope': 'openid email profile'},
    access_token_url='https://oauth2.googleapis.com/token',
    access_token_params=None,
    client_kwargs={'scope': 'openid email profile'},
    redirect_uri='http://localhost:5000/api/login/callback',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration'
)

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin):
    def __init__(self, user_id, name, email):
        self.id = user_id
        self.name = name
        self.email = email

users = {}

@login_manager.user_loader
def load_user(user_id):
    return users.get(user_id)

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Authentication required"}), 401

# Configurations
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session:
            return jsonify({"error": "Admin authentication required"}), 403
        return f(*args, **kwargs)
    return decorated_function

def extract_email_from_text(text):
    """Fallback regex extractor for emails if NER misses them."""
    pattern = r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}'
    matches = re.findall(pattern, text)
    return matches[0] if matches else None

# ========================
# AUTH API ENDPOINTS
# ========================

@app.route('/')
def home():
    return "Hello"

@app.route('/api/auth/status')
def auth_status():
    """Check current authentication status and onboarding state."""
    user_data = session.get('user')
    is_admin = session.get('admin_logged_in', False)
    is_logged_in = current_user.is_authenticated if hasattr(current_user, 'is_authenticated') else False

    has_profile = False
    if is_logged_in and current_user.id:
        profile = HirerProfile.query.filter_by(google_id=current_user.id).first()
        has_profile = profile is not None

    return jsonify({
        "logged_in": is_logged_in,
        "user": user_data,
        "is_admin": is_admin,
        "has_profile": has_profile
    })

@app.route('/api/google-login')
def google_login():
    redirect_uri = 'http://localhost:5000/api/login/callback'
    print("Redirect URI being sent:", redirect_uri)
    return google.authorize_redirect(redirect_uri=redirect_uri)

@app.route('/api/login/callback')
def authorized():
    token = google.authorize_access_token()
    user_info = google.get('https://www.googleapis.com/oauth2/v2/userinfo').json()
    if not token:
        return jsonify({"error": "Access denied"}), 403

    session['user'] = {
        'name': user_info['name'],
        'email': user_info['email'],
        'picture': user_info.get('picture', '')
    }

    user_info2 = google.get("https://www.googleapis.com/oauth2/v1/userinfo").json()
    user = User(user_info2["id"], user_info2["name"], user_info2["email"])
    users[user_info2["id"]] = user
    login_user(user)

    # Redirect to React frontend after login
    return '<script>window.location.href="http://localhost:5173";</script>'

@app.route('/api/logout')
@login_required
def logout():
    logout_user()
    session.pop('user', None)
    session.clear()
    return jsonify({"message": "Logged out successfully"})

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        session['admin_logged_in'] = True
        session['admin_username'] = username
        return jsonify({"message": "Admin logged in successfully"})
    return jsonify({"error": "Invalid admin credentials"}), 401

@app.route('/api/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return jsonify({"message": "Admin logged out successfully"})

# ========================
# HIRER PROFILE API
# ========================

@app.route('/api/hirer/profile', methods=['GET'])
@login_required
def get_hirer_profile():
    """Get the current hirer's company profile."""
    profile = HirerProfile.query.filter_by(google_id=current_user.id).first()
    if not profile:
        return jsonify({"profile": None, "has_profile": False})

    return jsonify({
        "has_profile": True,
        "profile": {
            "company_name": profile.company_name,
            "company_size": profile.company_size,
            "industry": profile.industry,
            "location": profile.location,
            "website": profile.website,
            "your_role": profile.your_role,
            "email": profile.email,
        }
    })

@app.route('/api/hirer/profile', methods=['POST'])
@login_required
def save_hirer_profile():
    """Create or update the current hirer's company profile."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    required = ['company_name', 'industry', 'company_size', 'your_role', 'location']
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400

    profile = HirerProfile.query.filter_by(google_id=current_user.id).first()
    user_data = session.get('user', {})

    if profile:
        # Update existing
        profile.company_name = data['company_name']
        profile.company_size = data['company_size']
        profile.industry     = data['industry']
        profile.location     = data['location']
        profile.website      = data.get('website', '')
        profile.your_role    = data['your_role']
        profile.email        = user_data.get('email', '')
        profile.updated_at   = datetime.utcnow()
    else:
        # Create new
        profile = HirerProfile(
            google_id    = current_user.id,
            email        = user_data.get('email', ''),
            company_name = data['company_name'],
            company_size = data['company_size'],
            industry     = data['industry'],
            location     = data['location'],
            website      = data.get('website', ''),
            your_role    = data['your_role'],
        )
        db.session.add(profile)

    db.session.commit()
    return jsonify({"message": "Profile saved successfully", "has_profile": True})

# ========================
# SEND EMAIL API
# ========================

@app.route('/api/send-email', methods=['POST'])
@login_required
def send_email():
    """Send an email from the hirer to a candidate."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    to_email = data.get('to_email', '').strip()
    subject  = data.get('subject', '').strip()
    body     = data.get('body', '').strip()

    if not to_email:
        return jsonify({"error": "Recipient email is required"}), 400
    if not subject:
        return jsonify({"error": "Subject is required"}), 400
    if not body:
        return jsonify({"error": "Email body is required"}), 400

    # Validate email format
    email_pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, to_email):
        return jsonify({"error": "Invalid recipient email address"}), 400

    try:
        msg = Message(
            subject=subject,
            recipients=[to_email],
            body=body
        )
        mail.send(msg)
        return jsonify({"message": f"Email sent successfully to {to_email}"})
    except Exception as e:
        print(f"Email error: {e}")
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500

# ========================
# PARSE RESUME API
# ========================

@app.route('/api/parse/resume', methods=['POST'])
@login_required
def api_parse_resume():
    resume_file = request.files.get('resume')
    if not resume_file or resume_file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    if not allowed_file(resume_file.filename):
        return jsonify({"error": "Invalid file format. Please upload PDF, DOCX, or TXT."}), 400

    resume_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(resume_file.filename))
    resume_file.save(resume_path)

    resume_text = extract_text(resume_path)
    resume_features = exResFeats(resume_text)
    resFeatures = displayResFeats(resume_features)

    return jsonify({"features": resFeatures, "message": "Parsing successful!"})

# ========================
# PARSE JOB API
# ========================

@app.route('/api/parse/job', methods=['POST'])
@login_required
def api_parse_job():
    job_file = request.files.get('job_description')
    if not job_file or job_file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    if not allowed_file(job_file.filename):
        return jsonify({"error": "Invalid file format. Please upload PDF, DOCX, or TXT."}), 400

    job_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(job_file.filename))
    job_file.save(job_path)

    job_text = extract_text(job_path)
    job_features = exJobFeats(job_text)
    jobFeatures = displayJobFeats(job_features)

    return jsonify({"features": jobFeatures, "message": "Parsing successful!"})

# ========================
# RANK API
# ========================

@app.route('/api/rank', methods=['POST'])
@login_required
def api_rank():
    job_file = request.files.get('job_description')
    if not job_file:
        return jsonify({"error": "No job description file provided"}), 400

    job_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(job_file.filename))
    job_file.save(job_path)

    resumes = request.files.getlist('resumes')
    if not resumes:
        return jsonify({"error": "No resume files provided"}), 400

    resume_paths = []
    for resume in resumes:
        resume_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(resume.filename))
        resume.save(resume_path)
        resume_paths.append(resume_path)

    # Process job description
    job_text = extract_text(job_path)
    job_features = exJobFeats(job_text)
    jobFeats = compJobFeats(job_features)

    ranked_resumes = []
    for resume_path in resume_paths:
        resume_text = extract_text(resume_path)
        resume_features = exResFeats(resume_text)
        resFeats = compResFeats(resume_features)

        similarity_results = calculate_similarity(jobFeats, resFeats)
        overall_score = similarity_results["overall_similarity_score"]

        # Get name from features
        name = "Unknown"
        if resFeats.get("applicant", {}).get("name"):
            name = resFeats["applicant"]["name"][0]
        else:
            name = os.path.basename(resume_path)

        # Get email — NER first, fallback to regex
        candidate_email = None
        raw_emails = resume_features[1]  # index 1 = email from exResFeats return tuple
        if raw_emails and len(raw_emails) > 0:
            candidate_email = raw_emails[0]
        if not candidate_email:
            candidate_email = extract_email_from_text(resume_text)

        ranked_resumes.append({
            "name": name,
            "resume_path": resume_path,
            "score": round(overall_score, 2),
            "experience_match": round(similarity_results.get("experience_match", 0), 2),
            "education_match": round(similarity_results.get("education_match", 0), 2),
            "skill_match": round(similarity_results.get("skill_match", 0), 2),
            "language_match": round(similarity_results.get("language_match", 0), 2),
            "candidate_email": candidate_email or "",
            "resume_text": resume_text # Needed for reranking
        })

    ranked_resumes.sort(key=lambda x: x["score"], reverse=True)

    # Apply Cross-Encoder Reranking on the top 5 candidates
    ranked_resumes = rerank_resumes(job_text, ranked_resumes, top_n=5)

    # Remove resume_text from response to keep it light
    for res in ranked_resumes:
        res.pop('resume_text', None)

    return jsonify({
        "ranked_resumes": ranked_resumes,
        "job_path": job_path,
        "message": "Ranking successful!"
    })

# ========================
# VIEW DETAILS API
# ========================

@app.route('/api/view-details', methods=['GET'])
def api_view_details():
    job_path = request.args.get('job_path')
    resume_path = request.args.get('resume_path')

    if not job_path or not resume_path:
        return jsonify({"error": "Missing job_path or resume_path"}), 400

    # Extract job details
    job_text = extract_text(job_path)
    job_features = exJobFeats(job_text)
    jobFeats = displayJobFeats(job_features)

    # Extract resume details
    resume_text = extract_text(resume_path)
    resume_features = exResFeats(resume_text)
    resFeats = displayResFeats(resume_features)

    # Get scores from query params
    experience_match = float(request.args.get('exp', 0.0))
    education_match = float(request.args.get('edu', 0.0))
    skill_match = float(request.args.get('skill', 0.0))
    language_match = float(request.args.get('lang', 0.0))
    similarity_score = float(request.args.get('score', 0.0))

    weights = session.get('weights', DEFAULT_WEIGHTS)
    is_admin = session.get('admin_logged_in', False)

    # Check if we have a saved summary for this candidate
    existing_cand = SavedCandidate.query.join(JobListing).filter(
        JobListing.job_path == job_path,
        SavedCandidate.resume_path == resume_path
    ).first()
    ai_summary = existing_cand.ai_summary if existing_cand else None


    return jsonify({
        "jobFeats": jobFeats,
        "resFeats": resFeats,
        "similarity_score": similarity_score,
        "experience_match": experience_match,
        "education_match": education_match,
        "skill_match": skill_match,
        "language_match": language_match,
        "weights": weights,
        "is_admin": is_admin,
        "ai_summary": ai_summary
    })

# ========================
# CUSTOMIZE WEIGHTS API
# ========================

@app.route('/api/customize', methods=['GET', 'POST'])
@admin_required
def api_customize():
    if request.method == 'POST':
        data = request.get_json()
        try:
            exp   = float(data.get('experience_weight', 0.3))
            edu   = float(data.get('education_weight', 0.2))
            skill = float(data.get('skill_weight', 0.4))
            lang  = float(data.get('language_weight', 0.1))

            total = exp + edu + skill + lang
            if total == 0:
                return jsonify({"error": "Total weight cannot be zero"}), 400

            session['weights'] = {
                'experience': exp / total,
                'education':  edu / total,
                'skill':      skill / total,
                'language':   lang / total
            }
            return jsonify({"message": "Weights updated successfully", "weights": session['weights']})
        except Exception as e:
            return jsonify({"error": str(e)}), 400

@app.route('/api/jobs/save', methods=['POST'])
@login_required
def api_save_job_history():
    """Save a ranking session results to the database."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    job_title = data.get('job_title', 'Untitled Job')
    job_path = data.get('job_path')
    candidates = data.get('candidates', [])
    
    if not candidates:
        return jsonify({"error": "No candidates to save"}), 400

    try:
        # Create Job Entry
        new_job = JobListing(
            title=job_title,
            job_path=job_path,
            user_id=current_user.id
        )
        db.session.add(new_job)
        db.session.flush() # Get the new_job.id

        # Batch generate AI summaries to save API quota
        ai_summaries = generate_bulk_summaries(candidates)
        
        # Save Candidates
        for i, cand in enumerate(candidates):
            new_cand = SavedCandidate(
                name=cand.get('name'),
                email=cand.get('candidate_email'),
                score=cand.get('score'),
                resume_path=cand.get('resume_path'),
                experience_match=cand.get('experience_match', 0.0),
                education_match=cand.get('education_match', 0.0),
                skill_match=cand.get('skill_match', 0.0),
                language_match=cand.get('language_match', 0.0),
                ai_summary=ai_summaries[i],
                job_id=new_job.id
            )
            db.session.add(new_cand)

        
        db.session.commit()
        return jsonify({"message": "Hiring session saved successfully", "job_id": new_job.id})
    except Exception as e:
        print(f"SAVE ERROR: {e}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/jobs', methods=['GET'])
@login_required
def api_get_jobs():
    """Fetch all past jobs for the current hirer."""
    try:
        print(f"FETCH JOBS for user: {current_user.id}")
        jobs = JobListing.query.filter_by(user_id=str(current_user.id)).order_by(JobListing.created_at.desc()).all()
        return jsonify({
            "jobs": [{
                "id": j.id,
                "title": j.title,
                "job_path": j.job_path,
                "created_at": j.created_at.isoformat(),
                "candidate_count": len(j.candidates)
            } for j in jobs]
        })
    except Exception as e:
        print(f"FETCH ERROR: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/jobs/<int:job_id>/candidates', methods=['GET'])
@login_required
def api_get_job_candidates(job_id):
    """Fetch all candidates for a specific job."""
    job = JobListing.query.get_or_404(job_id)
    if job.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    return jsonify({
        "job_title": job.title,
        "candidates": [{
            "id": c.id,
            "name": c.name,
            "email": c.email,
            "score": c.score,
            "resume_path": c.resume_path,
            "status": c.status,
            "experience_match": c.experience_match,
            "education_match": c.education_match,
            "skill_match": c.skill_match,
            "language_match": c.language_match,
            "ai_summary": c.ai_summary,
            "created_at": c.created_at.isoformat()
        } for c in job.candidates]
    })

@app.route('/api/candidates/<int:cand_id>/status', methods=['POST'])
@login_required
def api_update_candidate_status(cand_id):
    """Update the status of a saved candidate."""
    data = request.get_json()
    new_status = data.get('status')
    if not new_status:
        return jsonify({"error": "Status is required"}), 400
    
    cand = SavedCandidate.query.get_or_404(cand_id)
    # Check if this candidate belongs to a job owned by the current user
    if cand.job.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    cand.status = new_status
    db.session.commit()
@app.route('/api/candidates/<int:cand_id>', methods=['DELETE'])
@login_required
def api_delete_candidate(cand_id):
    """Delete a saved candidate."""
    cand = SavedCandidate.query.get_or_404(cand_id)
    # Check ownership via the linked job
    if cand.job.user_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    db.session.delete(cand)
    db.session.commit()
    return jsonify({"message": "Candidate deleted successfully"})

# ========================
# PRODUCTION FRONTEND SERVING
# ========================

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host="localhost", port=5000)

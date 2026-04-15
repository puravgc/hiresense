from flask import Flask, request, jsonify, session, send_file
from flask_session import Session
from flask_cors import CORS
from werkzeug.utils import secure_filename
from authlib.integrations.flask_client import OAuth
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import os
from dotenv import load_dotenv
from functools import wraps
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

# Initialize Flask app
app = Flask(__name__)

# CORS: allow React frontend to talk to this API
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

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

# ========================
# AUTH API ENDPOINTS
# ========================

@app.route('/')
def home():
    return "Hello"

@app.route('/api/auth/status')
def auth_status():
    """Check current authentication status"""
    user_data = session.get('user')
    is_admin = session.get('admin_logged_in', False)
    is_logged_in = current_user.is_authenticated if hasattr(current_user, 'is_authenticated') else False
    return jsonify({
        "logged_in": is_logged_in,
        "user": user_data,
        "is_admin": is_admin
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

        ranked_resumes.append({
            "name": name,
            "resume_path": resume_path,
            "score": round(overall_score, 2),
            "experience_match": round(similarity_results.get("experience_match", 0), 2),
            "education_match": round(similarity_results.get("education_match", 0), 2),
            "skill_match": round(similarity_results.get("skill_match", 0), 2),
            "language_match": round(similarity_results.get("language_match", 0), 2),
        })

    ranked_resumes.sort(key=lambda x: x["score"], reverse=True)

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

    return jsonify({
        "jobFeats": jobFeats,
        "resFeats": resFeats,
        "similarity_score": similarity_score,
        "experience_match": experience_match,
        "education_match": education_match,
        "skill_match": skill_match,
        "language_match": language_match,
        "weights": weights,
        "is_admin": is_admin
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
            exp = float(data.get('experience_weight', 0.3))
            edu = float(data.get('education_weight', 0.2))
            skill = float(data.get('skill_weight', 0.4))
            lang = float(data.get('language_weight', 0.1))

            total = exp + edu + skill + lang
            if total == 0:
                return jsonify({"error": "Total weight cannot be zero"}), 400

            session['weights'] = {
                'experience': exp / total,
                'education': edu / total,
                'skill': skill / total,
                'language': lang / total
            }
            return jsonify({"message": "Weights updated successfully", "weights": session['weights']})
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    weights = session.get('weights', DEFAULT_WEIGHTS)
    return jsonify({"weights": weights})

if __name__ == '__main__':
    app.run(debug=True, host="localhost", port=5000)

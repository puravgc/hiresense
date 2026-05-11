import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Onboarding.css';

const INDUSTRIES = [
  'Technology', 'Finance & Banking', 'Healthcare', 'Education',
  'Retail & E-commerce', 'Manufacturing', 'Media & Entertainment',
  'Logistics & Supply Chain', 'Real Estate', 'Consulting', 'Other',
];

const COMPANY_SIZES = [
  { label: '1–10 (Startup)', value: '1-10' },
  { label: '11–50 (Small)', value: '11-50' },
  { label: '51–200 (Medium)', value: '51-200' },
  { label: '201–1000 (Large)', value: '201-1000' },
  { label: '1000+ (Enterprise)', value: '1000+' },
];

const ROLES = [
  'HR Manager', 'HR Executive', 'Recruiter', 'Talent Acquisition Specialist',
  'Hiring Manager', 'Founder / CEO', 'Director', 'Other',
];

const STEPS = ['Company Info', 'Your Role', 'All Set!'];

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState('forward');
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    company_name: '',
    industry: '',
    company_size: '',
    website: '',
    your_role: '',
    location: '',
  });

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const goTo = (next, dir = 'forward') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 320);
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.company_name.trim()) return 'Please enter your company name.';
      if (!form.industry) return 'Please select an industry.';
      if (!form.company_size) return 'Please select a company size.';
    }
    if (step === 1) {
      if (!form.your_role) return 'Please select your role.';
      if (!form.location.trim()) return 'Please enter your location.';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    goTo(step + 1, 'forward');
  };

  const handleBack = () => {
    setError('');
    goTo(step - 1, 'back');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await API.post('/hirer/profile', form);
      await refreshProfile();
      navigate('/dashboard');
    } catch (e) {
      setError(e.response?.data?.error || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const slideClass = animating
    ? direction === 'forward' ? 'slide-out-left' : 'slide-out-right'
    : direction === 'forward' ? 'slide-in-right' : 'slide-in-left';

  return (
    <div className="onboarding-bg">
      <div className="onboarding-card">

        {/* Logo + Title */}
        <div className="onboarding-top">
          <img src="/images/skillSync7.png" alt="HireSense" className="onboarding-logo" />
          <h1 className="onboarding-title">Welcome to HireSense</h1>
          <p className="onboarding-subtitle">
            Hi <strong>{user?.name?.split(' ')[0] || 'there'}</strong>! Let's set up your hiring profile.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="onboarding-progress">
          {STEPS.map((label, i) => (
            <div key={i} className="progress-step">
              <div className={`progress-dot ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`progress-label ${i <= step ? 'active' : ''}`}>{label}</span>
              {i < STEPS.length - 1 && (
                <div className={`progress-line ${i < step ? 'active' : ''}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className={`onboarding-step ${slideClass}`}>

          {step === 0 && (
            <div className="step-content">
              <h2 className="step-heading">Tell us about your company</h2>

              <div className="form-group">
                <label htmlFor="company_name">Company Name <span className="required">*</span></label>
                <input
                  id="company_name"
                  type="text"
                  className="ob-input"
                  placeholder="e.g. Acme Technologies"
                  value={form.company_name}
                  onChange={e => update('company_name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="industry">Industry <span className="required">*</span></label>
                <select
                  id="industry"
                  className="ob-input"
                  value={form.industry}
                  onChange={e => update('industry', e.target.value)}
                >
                  <option value="">Select an industry…</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="company_size">Company Size <span className="required">*</span></label>
                <div className="size-chips">
                  {COMPANY_SIZES.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      id={`size-${s.value}`}
                      className={`size-chip ${form.company_size === s.value ? 'selected' : ''}`}
                      onClick={() => update('company_size', s.value)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="website">Company Website <span className="optional">(optional)</span></label>
                <input
                  id="website"
                  type="url"
                  className="ob-input"
                  placeholder="https://yourcompany.com"
                  value={form.website}
                  onChange={e => update('website', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="step-content">
              <h2 className="step-heading">About you</h2>

              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  className="ob-input"
                  value={user?.name || ''}
                  disabled
                  style={{ opacity: 0.65, cursor: 'not-allowed' }}
                />
                <small className="hint">Pulled from your Google account</small>
              </div>

              <div className="form-group">
                <label htmlFor="your_role">Your Role <span className="required">*</span></label>
                <select
                  id="your_role"
                  className="ob-input"
                  value={form.your_role}
                  onChange={e => update('your_role', e.target.value)}
                >
                  <option value="">Select your role…</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">Office Location / City <span className="required">*</span></label>
                <input
                  id="location"
                  type="text"
                  className="ob-input"
                  placeholder="e.g. Kathmandu, Nepal"
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content step-done">
              <div className="done-icon">🎉</div>
              <h2 className="step-heading">You're all set!</h2>
              <p className="done-sub">Here's your hiring profile summary:</p>
              <div className="summary-card">
                <div className="summary-row">
                  <span className="s-label">🏢 Company</span>
                  <span className="s-value">{form.company_name}</span>
                </div>
                <div className="summary-row">
                  <span className="s-label">💼 Industry</span>
                  <span className="s-value">{form.industry}</span>
                </div>
                <div className="summary-row">
                  <span className="s-label">👥 Size</span>
                  <span className="s-value">{form.company_size} employees</span>
                </div>
                <div className="summary-row">
                  <span className="s-label">📍 Location</span>
                  <span className="s-value">{form.location}</span>
                </div>
                <div className="summary-row">
                  <span className="s-label">🧑‍💼 Your Role</span>
                  <span className="s-value">{form.your_role}</span>
                </div>
                {form.website && (
                  <div className="summary-row">
                    <span className="s-label">🌐 Website</span>
                    <span className="s-value">{form.website}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && <div className="ob-error">{error}</div>}

        {/* Navigation */}
        <div className="onboarding-nav">
          {step > 0 && step < 2 && (
            <button className="ob-btn secondary" onClick={handleBack} disabled={loading}>
              ← Back
            </button>
          )}
          {step < 1 && (
            <button className="ob-btn primary" onClick={handleNext}>
              Continue →
            </button>
          )}
          {step === 1 && (
            <button className="ob-btn primary" onClick={handleNext}>
              Review →
            </button>
          )}
          {step === 2 && (
            <button className="ob-btn primary launch" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <span className="ob-spinner" />
              ) : (
                "🚀 Let's Start Hiring"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const WEIGHT_ICONS = { experience: '💼', education: '🎓', skill: '⚡', language: '🌐' };

export default function Customize() {
  const { isAdmin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [weights, setWeights] = useState({ experience: 0.3, education: 0.2, skill: 0.4, language: 0.1 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate('/admin-login'); return; }
    API.get('/customize').then(res => setWeights(res.data.weights)).catch(() => {});
  }, [isAdmin, navigate]);

  const handleSlider = (key, val) => {
    const nw = { ...weights, [key]: parseFloat(val) };
    const total = Object.values(nw).reduce((a, b) => a + b, 0);
    if (!total) return;
    const normed = {};
    for (const k in nw) normed[k] = parseFloat((nw[k] / total).toFixed(3));
    setWeights(normed);
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/customize', {
        experience_weight: weights.experience,
        education_weight: weights.education,
        skill_weight: weights.skill,
        language_weight: weights.language,
      });
      setSaved(true);
      setTimeout(() => navigate('/rank'), 1000);
    } catch (err) {
      alert('Error saving: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = async () => { await adminLogout(); navigate('/'); };

  return (
    <div className="page animate-up">
      <div className="page-header">
        <span className="page-icon">⚖️</span>
        <h1 className="page-title">Customize Weights</h1>
        <p className="page-subtitle">Adjust how much each factor contributes to the final ranking score. Weights are automatically normalized to sum to 1.</p>
      </div>
      <hr className="page-divider" />

      <div className="card-dark" style={{ maxWidth: 560, margin: '0 auto' }}>
        {saved && <div className="alert-dark success" style={{ marginBottom: '1rem' }}>✅ Weights saved! Redirecting…</div>}

        <form onSubmit={handleSubmit}>
          {Object.entries(weights).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {WEIGHT_ICONS[key]} {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <span style={{
                  background: 'rgba(108,99,255,0.15)',
                  border: '1px solid rgba(108,99,255,0.3)',
                  color: '#a78bfa',
                  borderRadius: '6px',
                  padding: '0.2rem 0.65rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font)',
                }}>
                  {(value * 100).toFixed(1)}%
                </span>
              </div>
              {/* Visual fill bar */}
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, marginBottom: '0.5rem', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${value * 100}%`, background: 'linear-gradient(90deg,#6c63ff,#a78bfa)', borderRadius: 3, transition: 'width 0.3s ease' }} />
              </div>
              <input
                type="range" min="0" max="1" step="0.01" value={value}
                onChange={e => handleSlider(key, e.target.value)}
                className="dark-range"
              />
            </div>
          ))}

          <div className="btn-group-row" style={{ marginTop: '1.5rem' }}>
            <button type="submit" className="btn-primary-dark" style={{ flex: 1, justifyContent: 'center' }}>
              💾 Save Weights
            </button>
            <button type="button" onClick={handleLogout} className="btn-danger-dark">
              Logout Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

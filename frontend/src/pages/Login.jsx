import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user) {
      API.get('/hirer/profile').then(res => setProfile(res.data.profile)).catch(() => {});
    }
  }, [user]);

  return (
    <div className="page animate-up">
      <div className="page-header">
        <span className="page-icon">👤</span>
        <h1 className="page-title">Account</h1>
        <p className="page-subtitle">Manage your account and company profile.</p>
      </div>
      <hr className="page-divider" />

      {user ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 580, margin: '0 auto' }}>
          {/* User Card */}
          <div className="card-dark" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <img src={user.picture} alt={user.name} style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid rgba(108,99,255,0.4)', flexShrink: 0 }} />
            <div>
              <h3 style={{ margin: '0 0 0.2rem', fontFamily: 'var(--font)', fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{user.name}</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem' }}>{user.email}</p>
              {profile && <p style={{ margin: '0.3rem 0 0', color: 'rgba(108,99,255,0.9)', fontSize: '0.82rem', fontWeight: 600 }}>{profile.your_role} · {profile.company_name}</p>}
            </div>
          </div>

          {/* Company Profile */}
          {profile && (
            <div className="card-dark">
              <div className="section-badge badge-purple" style={{ marginBottom: '1rem' }}>Company Profile</div>
              <table className="dark-table">
                <tbody>
                  {[
                    ['🏢 Company', profile.company_name],
                    ['💼 Industry', profile.industry],
                    ['👥 Size', `${profile.company_size} employees`],
                    ['📍 Location', profile.location],
                    ['🧑‍💼 Your Role', profile.your_role],
                    profile.website && ['🌐 Website', profile.website],
                  ].filter(Boolean).map(([label, val]) => (
                    <tr key={label}>
                      <td style={{ color: 'rgba(255,255,255,0.4)', width: '40%', padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}>{label}</td>
                      <td style={{ color: '#fff', padding: '0.55rem 0.85rem', fontSize: '0.88rem' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link to="/onboarding" className="btn-outline-dark" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                ✏️ Edit Profile
              </Link>
            </div>
          )}

          {/* Logout */}
          <button onClick={logout} className="btn-danger-dark" style={{ alignSelf: 'flex-start' }}>
            → Sign Out
          </button>
        </div>
      ) : (
        <div className="card-dark" style={{ maxWidth: 440, margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h3 style={{ color: '#fff', fontFamily: 'var(--font)', margin: '0 0 0.5rem' }}>Sign in to continue</h3>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Use your Google account to access HireSense.</p>
          <button
            onClick={() => window.location.href = 'http://localhost:5000/api/google-login'}
            className="btn-primary-dark"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          >
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}

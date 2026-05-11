import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await adminLogin(username, password);
      if (success) navigate('/customize');
    } catch {
      setError('Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page animate-up">
      <div className="page-header">
        <span className="page-icon">🔐</span>
        <h1 className="page-title">Admin Login</h1>
        <p className="page-subtitle">Access the admin panel to customize ranking weights.</p>
      </div>
      <hr className="page-divider" />

      <div className="card-dark" style={{ maxWidth: 440, margin: '0 auto' }}>
        {error && <div className="alert-dark error" style={{ marginBottom: '1.25rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="adm-username">Username</label>
            <input id="adm-username" type="text" className="dark-input" placeholder="admin" required value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="adm-password">Password</label>
            <input id="adm-password" type="password" className="dark-input" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary-dark" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}>
            {loading ? '…' : '🔐 Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}

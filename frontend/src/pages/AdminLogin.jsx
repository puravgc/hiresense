import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const success = await adminLogin(username, password);
      if (success) {
        navigate('/customize');
      }
    } catch {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="container">
      <div className="jumbotron">
        <img src="/images/admin.png" height="50" style={{ display: 'block', margin: 'auto' }} alt="admin logo" />
        <br />
        <h1 style={{ textAlign: 'center', color: 'black', fontSize: '30px', fontFamily: "'Barlow', sans-serif" }}>Admin Login</h1>
        <hr />
        <br />
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} style={{ fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>
          <div className="mb-3 row">
            <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
            <div className="col-sm-10">
              <input type="text" className="form-control form-control-lg" id="username" placeholder="username" required value={username} onChange={e => setUsername(e.target.value)} />
            </div>
          </div>
          <div className="mb-3 row">
            <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
            <div className="col-sm-10">
              <input type="password" className="form-control form-control-lg" id="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="d-grid gap-2 col-2 mx-auto">
            <button type="submit" className="btn btn-dark" style={{ marginTop: '20px' }}>Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

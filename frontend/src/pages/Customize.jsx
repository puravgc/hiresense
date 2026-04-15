import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Customize() {
  const { isAdmin, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [weights, setWeights] = useState({
    experience: 0.3,
    education: 0.2,
    skill: 0.4,
    language: 0.1,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    API.get('/customize').then(res => {
      setWeights(res.data.weights);
    }).catch(() => {});
  }, [isAdmin, navigate]);

  const handleSliderChange = (key, value) => {
    const newWeights = { ...weights, [key]: parseFloat(value) };
    const total = Object.values(newWeights).reduce((a, b) => a + b, 0);
    if (total === 0) return;
    const normalized = {};
    for (const k in newWeights) {
      normalized[k] = parseFloat((newWeights[k] / total).toFixed(2));
    }
    setWeights(normalized);
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
      navigate('/rank');
    } catch (err) {
      alert('Error saving weights: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    navigate('/');
  };

  return (
    <div className="container">
      <div className="jumbotron">
        <img src="/images/equalizer.png" height="50" style={{ display: 'block', margin: 'auto' }} alt="equalizer" />
        <br />
        <h1 style={{ textAlign: 'center', color: 'black', fontSize: '30px', fontFamily: "'Barlow', sans-serif" }}>Customize Feature Weights</h1>
        <form onSubmit={handleSubmit}>
          {Object.entries(weights).map(([key, value]) => (
            <div className="form-group" key={key}>
              <label className="form-label" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {key.charAt(0).toUpperCase() + key.slice(1)} Weight: <span>{value}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={value}
                onChange={(e) => handleSliderChange(key, e.target.value)}
                className="form-range custom-range"
              />
            </div>
          ))}
          <br />
          <button type="submit" className="btn btn-dark" style={{ fontFamily: "'Barlow', sans-serif" }}>Save Weights</button>
        </form>
        <br />
        <button onClick={handleLogout} className="btn btn-outline-dark" style={{ fontFamily: "'Barlow', sans-serif" }}>Logout</button>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Toast from '../components/Toast';

export default function ParseResume() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = () => {
    if (file) {
      setUploaded(true);
      setToast({ message: 'Resume uploaded successfully!', type: 'success' });
    } else {
      setToast({ message: 'Please select a resume first!', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploaded) {
      setToast({ message: 'Please select and upload a resume first!', type: 'warning' });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await API.post('/parse/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/resume-details', { state: { features: res.data.features } });
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Parsing failed!', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {loading && (
        <div id="loading">
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="jumbotron">
        <img src="/images/resume.png" height="50" style={{ display: 'block', margin: 'auto' }} alt="resume" />
        <br />
        <h1 style={{ textAlign: 'center', color: 'black', fontSize: '30px', fontFamily: "'Barlow', sans-serif" }}>Resume Parser</h1>
        <hr />
        <br />
        <h5 style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>
          Upload a <strong>Resume</strong> and hit the <strong>Parse</strong> button to parse your resume...
        </h5>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'black', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Resume:</label>
            <div className="input-group" style={{ fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>
              <input type="file" className="form-control" accept=".pdf,.docx,.txt" onChange={e => { setFile(e.target.files[0]); setUploaded(false); }} required />
              <button className="btn btn-secondary" type="button" onClick={handleUpload} style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Upload</button>
            </div>
          </div>
          <br />
          <input type="submit" className="btn btn-dark btn-lg" value="Parse" style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }} />
        </form>
      </div>
    </div>
  );
}

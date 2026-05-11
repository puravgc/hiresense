import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Toast from '../components/Toast';
import FileDropzone from '../components/FileDropzone';

export default function ParseJob() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFilesSelected = (selectedFile) => {
    setFile(selectedFile);
    setUploaded(true);
    setToast({ message: 'Job description ready!', type: 'success' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setToast({ message: 'Please select the job description first.', type: 'warning' }); return; }
    setLoading(true);
    const formData = new FormData();
    formData.append('job_description', file);
    try {
      const res = await API.post('/parse/job', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/job-details', { state: { features: res.data.features } });
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Parsing failed!', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="page animate-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {loading && (
        <div id="loading">
          <div className="loading-spinner" />
          <span className="loading-text">Parsing job description…</span>
        </div>
      )}

      <div className="page-header">
        <span className="page-icon">💼</span>
        <h1 className="page-title">Job Description Parser</h1>
        <p className="page-subtitle">Upload a job description and extract required skills, experience, and more.</p>
      </div>
      <hr className="page-divider" />

      <div className="card-dark" style={{ maxWidth: 560, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Job Description File <span style={{ color: '#f87171' }}>*</span></label>
            <FileDropzone onFilesSelected={handleFilesSelected} />
          </div>

          <button 
            type="submit" 
            className="btn-primary-dark" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '1rem' }}
            disabled={!file}
          >
            🔍 Parse Job Description
          </button>
        </form>
      </div>
    </div>
  );
}

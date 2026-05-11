import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Toast from '../components/Toast';
import FileDropzone from '../components/FileDropzone';

export default function Rank() {
  const [jobFile, setJobFile] = useState(null);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJobSelected = (file) => {
    setJobFile(file);
    setToast({ message: 'Job description ready!', type: 'success' });
  };

  const handleResumesSelected = (files) => {
    setResumeFiles(files);
    setToast({ message: `${files.length} resume(s) ready!`, type: 'success' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobFile || resumeFiles.length === 0) {
      setToast({ message: 'Please select both a job description and at least one resume.', type: 'warning' });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('job_description', jobFile);
    for (const file of resumeFiles) formData.append('resumes', file);
    try {
      const res = await API.post('/rank', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/results', { state: res.data });
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Ranking failed!', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="page animate-up">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {loading && (
        <div id="loading">
          <div className="loading-spinner" />
          <span className="loading-text">Ranking resumes… this may take a moment</span>
        </div>
      )}

      <div className="page-header">
        <span className="page-icon">🏆</span>
        <h1 className="page-title">Resume Ranking</h1>
        <p className="page-subtitle">Upload a job description and multiple resumes — get an AI-ranked shortlist instantly.</p>
      </div>
      <hr className="page-divider" />

      <div className="card-dark" style={{ maxWidth: 620, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Job Description */}
          <div className="form-field" style={{ marginBottom: '2rem' }}>
            <label>Job Description <span style={{ color: '#f87171' }}>*</span></label>
            <FileDropzone onFilesSelected={handleJobSelected} />
          </div>

          {/* Resumes */}
          <div className="form-field" style={{ marginBottom: '2rem' }}>
            <label>Resumes <span style={{ color: '#f87171' }}>*</span></label>
            <FileDropzone onFilesSelected={handleResumesSelected} multiple={true} />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="btn-primary-dark" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
              disabled={!jobFile || resumeFiles.length === 0}
            >
              🏆 Rank Resumes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

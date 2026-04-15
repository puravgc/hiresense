import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Toast from '../components/Toast';

export default function Rank() {
  const [jobFile, setJobFile] = useState(null);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [jobUploaded, setJobUploaded] = useState(false);
  const [resUploaded, setResUploaded] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJobUpload = () => {
    if (jobFile) {
      setJobUploaded(true);
      setToast({ message: 'Job post uploaded successfully!', type: 'success' });
    } else {
      setToast({ message: 'Please select a job description first!', type: 'error' });
    }
  };

  const handleResUpload = () => {
    if (resumeFiles.length > 0) {
      setResUploaded(true);
      setToast({ message: 'Resume(s) uploaded successfully!', type: 'success' });
    } else {
      setToast({ message: 'Please select resume(s) first!', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobUploaded && !resUploaded) {
      setToast({ message: 'Ranking unsuccessful! No files uploaded', type: 'error' });
      return;
    }
    if (!jobUploaded) {
      setToast({ message: 'Please select and upload a job post first!', type: 'warning' });
      return;
    }
    if (!resUploaded) {
      setToast({ message: 'Please select and upload a resume first!', type: 'warning' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('job_description', jobFile);
    for (const file of resumeFiles) {
      formData.append('resumes', file);
    }

    try {
      const res = await API.post('/rank', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/results', { state: res.data });
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Ranking failed!', type: 'error' });
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
        <img src="/images/ranking.png" height="50" style={{ display: 'block', margin: 'auto' }} alt="ranking" />
        <br />
        <h1 style={{ textAlign: 'center', color: 'black', fontSize: '30px', fontFamily: "'Barlow', sans-serif" }}>Resume Ranking</h1>
        <hr />
        <br />
        <h5 style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>
          Upload the job description and resume files and hit the <strong>Rank</strong> button to rank your resumes...
        </h5>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'black', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Job Description:</label>
            <div className="input-group" style={{ fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>
              <input type="file" className="form-control" accept=".pdf,.docx,.txt" onChange={e => { setJobFile(e.target.files[0]); setJobUploaded(false); }} required />
              <button className="btn btn-secondary" type="button" onClick={handleJobUpload} style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Upload</button>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: 'black', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Resume(s):</label>
            <div className="input-group" style={{ fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>
              <input type="file" className="form-control" accept=".pdf,.docx,.txt" multiple onChange={e => { setResumeFiles(Array.from(e.target.files)); setResUploaded(false); }} required />
              <button className="btn btn-secondary" type="button" onClick={handleResUpload} style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Upload</button>
            </div>
          </div>
          <br />
          <input type="submit" className="btn btn-dark btn-lg" value="Rank" style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }} />
        </form>
      </div>
    </div>
  );
}

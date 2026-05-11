import { Link } from 'react-router-dom';

export default function Intro() {
  const downloadFile = (filename) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = filename;
    document.body.appendChild(iframe);
  };

  return (
    <div className="page animate-up">
      <div className="page-header">
        <span className="page-icon">📘</span>
        <h1 className="page-title">How To Use HireSense</h1>
        <p className="page-subtitle">A quick guide to formatting your files and getting the best precision from our AI models.</p>
      </div>
      <hr className="page-divider" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 800, margin: '0 auto' }}>
        
        {/* Supported Formats */}
        <div className="card-dark">
          <div className="section-badge badge-purple" style={{ marginBottom: '1rem' }}>Supported Formats</div>
          <h3 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1.1rem', fontFamily: 'var(--font)' }}>File Types</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
            To ensure our NER model can accurately parse text, please upload your resumes and job descriptions in one of the following standard formats:
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {['📄 PDF', '📝 DOCX', '📃 TXT'].map(ext => (
              <div key={ext} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>
                {ext}
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="card-dark">
          <div className="section-badge badge-green" style={{ marginBottom: '1rem' }}>Optimal Structure</div>
          <h3 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1.1rem', fontFamily: 'var(--font)' }}>Using Templates</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            While our AI can extract information from mostly any layout, using a clear structured format guarantees the highest precision. We've provided templates you can use to structure your data.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.2rem', color: '#fff', fontSize: '0.95rem' }}>Resume Template</h4>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Standardized sections for skills, education, and experience.</p>
              </div>
              <button onClick={() => downloadFile('/docx/resume.docx')} className="btn-outline-dark" style={{ width: '100%', justifyContent: 'center' }}>
                ⬇️ Download Resume DOCX
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.2rem', color: '#fff', fontSize: '0.95rem' }}>JD Template</h4>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Clear structure for requirements, responsibilities, and tools.</p>
              </div>
              <button onClick={() => downloadFile('/docx/job.docx')} className="btn-outline-dark" style={{ width: '100%', justifyContent: 'center' }}>
                ⬇️ Download JD DOCX
              </button>
            </div>
          </div>
        </div>

        {/* Weights */}
        <div className="card-dark">
          <div className="section-badge badge-purple" style={{ marginBottom: '1rem' }}>Ranking Metrics</div>
          <h3 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1.1rem', fontFamily: 'var(--font)' }}>Understanding Weights</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
            By default, HireSense ranks candidates by comparing extracted features against the job description using the following weight distribution. Admins can customize these weights globally in the Admin panel.
          </p>

          <table className="dark-table" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <thead>
              <tr>
                <th>Feature Matrix</th>
                <th>Default Influence Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Skills</strong> (Hard, Soft, Tools)</td>
                <td><span style={{ color: 'var(--primary-2)', fontWeight: 700 }}>40%</span> (0.4)</td>
              </tr>
              <tr>
                <td><strong>Experience</strong> (Duration, Roles)</td>
                <td><span style={{ color: 'var(--primary-2)', fontWeight: 700 }}>30%</span> (0.3)</td>
              </tr>
              <tr>
                <td><strong>Education</strong> (Degree, Field)</td>
                <td><span style={{ color: 'var(--primary-2)', fontWeight: 700 }}>20%</span> (0.2)</td>
              </tr>
              <tr>
                <td><strong>Languages</strong></td>
                <td><span style={{ color: 'var(--primary-2)', fontWeight: 700 }}>10%</span> (0.1)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Start */}
        <div className="card-dark" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(167,139,250,0.05))', borderColor: 'rgba(108,99,255,0.2)' }}>
          <h3 style={{ margin: '0 0 0.5rem', color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font)' }}>Ready to begin?</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.92rem', margin: '0 0 1.5rem' }}>
            Jump into the action by using one of the core tools below.
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <Link to="/rank" className="btn-primary-dark">🏆 Rank Resumes</Link>
            <Link to="/parse-resume" className="btn-outline-dark">📄 Parse Resume</Link>
            <Link to="/parse-job" className="btn-outline-dark">💼 Parse JD</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

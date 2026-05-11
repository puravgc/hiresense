import { useLocation, Link } from 'react-router-dom';

export default function JobDetails() {
  const location = useLocation();
  const features = location.state?.features || {};

  const rows = [
    ['💼 Job Title', features.title], ['⚡ Hard Skills', features.hards],
    ['🤝 Soft Skills', features.softs], ['🔧 Tools', features.tools],
    ['📦 Products', features.products], ['🕰 Experience', features.experience],
    ['🎓 Education', features.education], ['🏢 Sector', features.sectors],
    ['🏆 Certifications', features.certifications], ['🌐 Language', features.language],
  ];

  return (
    <div className="page animate-up">
      <div className="page-header">
        <span className="page-icon">💼</span>
        <h1 className="page-title">Job Description Details</h1>
        <p className="page-subtitle">Extracted requirements from the job description</p>
      </div>
      <hr className="page-divider" />

      <div className="card-dark" style={{ padding: 0, overflow: 'hidden', maxWidth: 700, margin: '0 auto' }}>
        <table className="dark-table">
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label}>
                <td style={{ color: 'rgba(255,255,255,0.45)', width: '35%', padding: '0.7rem 1rem', fontSize: '0.85rem' }}>{label}</td>
                <td style={{ color: '#fff', padding: '0.7rem 1rem', fontSize: '0.88rem' }}>
                  {value ? String(value) : <span style={{ color: 'rgba(255,255,255,0.22)' }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/parse-job" className="btn-outline-dark">← Parse Another Job Description</Link>
      </div>
    </div>
  );
}

import { useLocation, Link } from 'react-router-dom';

export default function ResumeDetails() {
  const location = useLocation();
  const features = location.state?.features || {};

  const rows = [
    ['👤 Name', features.name], ['📧 Email', features.email], ['📞 Phone', features.phone],
    ['🔗 Links', features.links], ['🎂 DOB', features.dob],
    ['💼 Experience Roles', features.exp_roles], ['⏱ Experience Fields', features.exp_fields],
    ['🎓 Education Degrees', features.edu_degrees], ['📚 Education Fields', features.edu_fields],
    ['⚡ Hard Skills', features.hards], ['🤝 Soft Skills', features.softs],
    ['🔧 Tools', features.tools], ['📦 Products', features.products],
    ['🏢 Sectors', features.sectors], ['🌐 Languages', features.language],
    ['🏆 Certifications', features.certifications],
  ];

  return (
    <div className="page animate-up">
      <div className="page-header">
        <span className="page-icon">📄</span>
        <h1 className="page-title">Resume Details</h1>
        <p className="page-subtitle">Extracted features from your resume</p>
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
        <Link to="/parse-resume" className="btn-outline-dark">← Parse Another Resume</Link>
      </div>
    </div>
  );
}

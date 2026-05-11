import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QUICK_ACTIONS = [
  { icon: '🏆', label: 'Rank Resumes', desc: 'Upload a JD and multiple CVs for instant ranked results.', to: '/rank', accent: '#6c63ff' },
  { icon: '📄', label: 'Parse a Resume', desc: 'Extract structured features from a single resume.', to: '/parse-resume', accent: '#10b981' },
  { icon: '💼', label: 'Parse a Job Description', desc: 'Extract requirements from any job description.', to: '/parse-job', accent: '#a78bfa' },
];

const HOW_IT_WORKS = [
  { n: '01', title: 'Upload Job Description', desc: 'PDF, DOCX, or TXT accepted.' },
  { n: '02', title: 'Upload Resumes', desc: 'Add as many candidate CVs as you need.' },
  { n: '03', title: 'Get Ranked Results', desc: 'AI scores every candidate instantly.' },
  { n: '04', title: 'Email Top Candidates', desc: 'Send invitations directly from HireSense.' },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page-wide animate-up">

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: '2.5rem 0 3rem' }}>
        <div className="section-badge badge-purple">AI-Powered Resume Ranking</div>
        <h1 style={{
          fontSize: 'clamp(2rem,4vw,3rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: '#fff',
          margin: '0.75rem 0 0.6rem',
          fontFamily: 'var(--font)',
        }}>
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto 2rem', lineHeight: 1.65 }}>
          HireSense uses NER-based AI to parse, score, and rank resumes — so you spend time interviewing the right people.
        </p>
        <Link to="/rank" className="btn-primary-dark" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
          🏆 Start Ranking Now
        </Link>
      </div>

      <hr className="page-divider" />

      {/* ── Quick Actions ── */}
      <div style={{ marginBottom: '3rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {QUICK_ACTIONS.map((a, i) => (
            <Link key={i} to={a.to} style={{ textDecoration: 'none' }}>
              <div className="card-dark" style={{ cursor: 'pointer', height: '100%' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{a.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: '0 0 0.4rem', fontFamily: 'var(--font)' }}>{a.label}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── How It Works ── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '2rem' }}>
        <div className="section-badge badge-green" style={{ marginBottom: '1.25rem' }}>How It Works</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.78rem', fontWeight: 800, color: '#fff',
                margin: '0 auto 0.85rem',
                boxShadow: '0 0 18px rgba(108,99,255,0.35)',
              }}>{s.n}</div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: '0 0 0.3rem', fontFamily: 'var(--font)' }}>{s.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

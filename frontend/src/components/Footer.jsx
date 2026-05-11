import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '3rem',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '2rem 1rem 1.5rem',
      fontFamily: 'var(--font)',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Brand */}
          <div>
            <h6 style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>HireSense</h6>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.82rem', lineHeight: 1.7, margin: 0 }}>
              NER-based AI resume ranking system. Parse, score, and rank candidates in seconds.
            </p>
          </div>
          {/* Links */}
          <div>
            <h6 style={{ color: '#fff', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Quick Links</h6>
            {[
              { to: '/dashboard', label: 'Home' },
              { to: '/intro', label: 'How It Works' },
              { to: '/about', label: 'About Us' },
            ].map(l => (
              <div key={l.to} style={{ marginBottom: '0.4rem' }}>
                <Link to={l.to} style={{ color: 'rgba(255,255,255,0.42)', fontSize: '0.83rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.42)'}
                >{l.label}</Link>
              </div>
            ))}
          </div>
          {/* Features */}
          <div>
            <h6 style={{ color: '#fff', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Features</h6>
            {[
              { to: '/parse-resume', label: 'Parse Resume' },
              { to: '/parse-job', label: 'Parse Job Description' },
              { to: '/rank', label: 'Rank Resumes' },
            ].map(l => (
              <div key={l.to} style={{ marginBottom: '0.4rem' }}>
                <Link to={l.to} style={{ color: 'rgba(255,255,255,0.42)', fontSize: '0.83rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.42)'}
                >{l.label}</Link>
              </div>
            ))}
          </div>
          {/* Contact */}
          <div>
            <h6 style={{ color: '#fff', fontWeight: 700, fontSize: '0.78rem', marginBottom: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Contact</h6>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.83rem', margin: '0 0 0.35rem' }}>📍 Lamachaur, Pokhara-16</p>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.83rem', margin: 0 }}>📞 981234567</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.78rem', margin: 0 }}>
            © 2025 HireSense · NER-Powered Resume Ranking System
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../api/axios';

const scoreColor = s => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#f87171';

function ScoreRow({ label, score, weight }) {
  const color = scoreColor(score);
  return (
    <tr>
      <td style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', padding: '0.65rem 1rem' }}>{label}</td>
      <td style={{ padding: '0.65rem 1rem' }}>
        <div className="score-bar-wrap">
          <div className="score-bar-track">
            <div className="score-bar-fill" style={{ width: `${Math.min(score, 100)}%`, background: color }} />
          </div>
          <span className="score-val" style={{ color }}>{score?.toFixed(2)}%</span>
        </div>
      </td>
      <td style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.82rem', padding: '0.65rem 1rem' }}>
        weight: {weight?.toFixed(2)}
      </td>
    </tr>
  );
}

function FeatureTable({ rows }) {
  return (
    <table className="dark-table" style={{ fontSize: '0.85rem' }}>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <td style={{ color: 'rgba(255,255,255,0.45)', width: '40%', padding: '0.55rem 0.85rem' }}>{label}</td>
            <td style={{ color: '#fff', padding: '0.55rem 0.85rem' }}>{value || <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ViewDetails() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/view-details', { params: Object.fromEntries(searchParams) })
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return (
    <div id="loading"><div className="loading-spinner" /><span className="loading-text">Loading details…</span></div>
  );
  if (!data) return <div className="page"><div className="alert-dark error">Error loading details.</div></div>;

  const { jobFeats, resFeats, similarity_score, experience_match, education_match, skill_match, language_match, weights, is_admin } = data;
  const overall = scoreColor(similarity_score);

  const jobRows = [
    ['Job Title', jobFeats?.title], ['Hard Skills', jobFeats?.hards], ['Soft Skills', jobFeats?.softs],
    ['Tools', jobFeats?.tools], ['Products', jobFeats?.products], ['Experience', jobFeats?.experience],
    ['Education', jobFeats?.education], ['Sector', jobFeats?.sectors], ['Certification', jobFeats?.certifications],
    ['Language', jobFeats?.language],
  ];

  const resRows = [
    ['Name', resFeats?.name], ['Hard Skills', resFeats?.hards], ['Soft Skills', resFeats?.softs],
    ['Tools', resFeats?.tools], ['Products', resFeats?.products], ['Experience', resFeats?.experience],
    ['Education', resFeats?.education], ['Sector', resFeats?.sectors], ['Certification', resFeats?.certifications],
    ['Language', resFeats?.language],
  ];

  return (
    <div className="page-wide animate-up">
      <div className="page-header" style={{ position: 'relative' }}>
        <Link to="/results" className="btn-outline-dark" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
          ← Back to Results
        </Link>
        <span className="page-icon">🔍</span>
        <h1 className="page-title">Match Details</h1>
        <p className="page-subtitle">Detailed breakdown of how this resume matches the job description</p>
      </div>
      <hr className="page-divider" />

      {/* Overall Score Banner */}
      <div style={{
        background: `rgba(${overall === '#10b981' ? '16,185,129' : overall === '#f59e0b' ? '245,158,11' : '248,113,113'},0.1)`,
        border: `1px solid ${overall}40`,
        borderRadius: 'var(--radius)',
        padding: '1.5rem',
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Overall Match Score {is_admin ? '(Custom Weights)' : '(Default Weights)'}
        </div>
        <div style={{ fontSize: '3rem', fontWeight: 900, color: overall, lineHeight: 1 }}>{similarity_score?.toFixed(2)}%</div>
      </div>

      {/* Score Breakdown */}
      <div className="card-dark" style={{ marginBottom: '2rem' }}>
        <div className="section-badge badge-purple" style={{ marginBottom: '1rem' }}>Score Breakdown</div>
        <table className="dark-table">
          <tbody>
            <ScoreRow label="Experience" score={experience_match} weight={weights?.experience} />
            <ScoreRow label="Education" score={education_match} weight={weights?.education} />
            <ScoreRow label="Skills" score={skill_match} weight={weights?.skill} />
            <ScoreRow label="Languages" score={language_match} weight={weights?.language} />
          </tbody>
        </table>
      </div>

      {/* Feature Tables Side by Side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="card-dark" style={{ padding: '1.25rem' }}>
          <div className="section-badge badge-purple" style={{ marginBottom: '0.85rem' }}>Job Description</div>
          <FeatureTable rows={jobRows} />
        </div>
        <div className="card-dark" style={{ padding: '1.25rem' }}>
          <div className="section-badge badge-green" style={{ marginBottom: '0.85rem' }}>Resume</div>
          <FeatureTable rows={resRows} />
        </div>
      </div>
    </div>
  );
}

import { useLocation, Link } from 'react-router-dom';

export default function Results() {
  const location = useLocation();
  const data = location.state || {};
  const rankedResumes = data.ranked_resumes || [];
  const jobPath = data.job_path || '';

  return (
    <div className="container">
      <div className="jumbotron">
        <img src="/images/ranking.png" height="50" style={{ display: 'block', margin: 'auto' }} alt="ranking" />
        <br />
        <h1 style={{ textAlign: 'center', color: 'black', fontSize: '30px', fontFamily: "'Barlow', sans-serif" }}>Ranked Resumes</h1>
        <hr />
        <br />
        <table className="table table-striped">
          <thead>
            <tr className="table-dark">
              <td style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>S.N</td>
              <td style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Name</td>
              <td style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Score</td>
              <td style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>View Details</td>
            </tr>
          </thead>
          <tbody>
            {rankedResumes.map((resume, i) => (
              <tr className="table-light" key={i} style={{ color: 'black', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>
                <td>{i + 1}</td>
                <td>{resume.name}</td>
                <td>{resume.score.toFixed(2)}</td>
                <td>
                  <Link
                    to={`/view-details?job_path=${encodeURIComponent(jobPath)}&resume_path=${encodeURIComponent(resume.resume_path)}&exp=${resume.experience_match}&edu=${resume.education_match}&skill=${resume.skill_match}&lang=${resume.language_match}&score=${resume.score}`}
                    className="btn btn-secondary btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <div className="d-flex justify-content-center gap-3">
          <Link to="/rank">
            <button type="button" className="btn btn-dark btn-lg" style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Go Back</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

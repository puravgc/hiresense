import { useLocation, Link } from 'react-router-dom';

const featureLabels = [
  { key: 'title', label: 'Job Title', desc: 'Title or position of the job post.' },
  { key: 'company', label: 'Company Name', desc: 'Name of the company that posted the job description.' },
  { key: 'experience', label: 'Experience', desc: 'Experience required for the job post.' },
  { key: 'education', label: 'Education', desc: 'Education qualifications required for the job post.' },
  { key: 'sectors', label: 'Sector', desc: 'Sectors or industries related to the job.' },
  { key: 'certifications', label: 'Certification', desc: 'Preferred certifications (if any).' },
  { key: 'hards', label: 'Hard Skills', desc: 'Technical skills expected of the applicant.' },
  { key: 'softs', label: 'Soft Skills', desc: 'Soft skills required for the job post.' },
  { key: 'tools', label: 'Tools', desc: 'Tools required for the applicant.' },
  { key: 'products', label: 'Products', desc: 'Products expected for the applicant to work on.' },
  { key: 'language', label: 'Language', desc: 'Languages required for the applicant.' },
];

export default function JobDetails() {
  const location = useLocation();
  const features = location.state?.features || {};

  return (
    <div className="container">
      <div className="jumbotron">
        <img src="/images/suitcase.png" height="50" style={{ display: 'block', margin: 'auto' }} alt="suitcase" />
        <br />
        <h1 style={{ textAlign: 'center', color: 'black', fontSize: '30px', fontFamily: "'Barlow', sans-serif" }}>Parsed Job Description Details</h1>
        <hr />
        <br />
        <table className="table table-striped">
          <thead>
            <tr className="table-dark">
              <td style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Features</td>
              <td style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Values</td>
            </tr>
          </thead>
          <tbody>
            {featureLabels.map(({ key, label, desc }) => (
              <tr className="table-light" key={key} style={{ color: 'black', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>
                <td title={desc}>{label}</td>
                <td>{typeof features[key] === 'object' ? JSON.stringify(features[key]) : (features[key] || 'Unknown')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <div className="d-grid gap-2 justify-content-md-center">
          <Link to="/parse-job"><button type="button" className="btn btn-dark btn-lg" style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Go Back</button></Link>
        </div>
      </div>
    </div>
  );
}

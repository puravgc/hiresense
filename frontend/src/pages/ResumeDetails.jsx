import { useLocation, Link } from 'react-router-dom';

const featureLabels = [
  { key: 'name', label: 'Name', desc: 'Full name of the applicant.' },
  { key: 'email', label: 'Email', desc: 'Email ID of the applicant.' },
  { key: 'links', label: 'Links', desc: 'Available links of the applicant.' },
  { key: 'phone', label: 'Phone', desc: 'Phone number of the applicant.' },
  { key: 'dob', label: 'DOB', desc: 'Date of birth of the applicant.' },
  { key: 'experience', label: 'Experience', desc: 'Experience of the applicant in terms of what they worked as followed by the duration and related fields.' },
  { key: 'education', label: 'Education', desc: 'Education qualifications of the applicant in terms of their degree and corresponding field of study.' },
  { key: 'sectors', label: 'Sector', desc: 'Sectors or industries that the applicant has worked in and around.' },
  { key: 'certifications', label: 'Certification', desc: 'Certifications of the applicant.' },
  { key: 'hards', label: 'Hard Skills', desc: 'Technical skills possessed by the applicant.' },
  { key: 'softs', label: 'Soft Skills', desc: 'Soft skills possessed by the applicant.' },
  { key: 'tools', label: 'Tools', desc: 'Tools the applicant holds expertise in.' },
  { key: 'products', label: 'Products', desc: 'Products contributed to by the applicant.' },
  { key: 'interests', label: 'Interests', desc: 'Interests and hobbies of the applicant.' },
  { key: 'language', label: 'Language', desc: 'Languages the applicant is proficient in.' },
];

export default function ResumeDetails() {
  const location = useLocation();
  const features = location.state?.features || {};

  return (
    <div className="container">
      <div className="jumbotron">
        <img src="/images/resume.png" height="50" style={{ display: 'block', margin: 'auto' }} alt="resume" />
        <br />
        <h1 style={{ textAlign: 'center', color: 'black', fontSize: '30px', fontFamily: "'Barlow', sans-serif" }}>Parsed Resume Details</h1>
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
          <Link to="/parse-resume"><button type="button" className="btn btn-dark btn-lg" style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Go Back</button></Link>
        </div>
      </div>
    </div>
  );
}

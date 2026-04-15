import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';

export default function ViewDetails() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get('/view-details', { params: Object.fromEntries(searchParams) });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [searchParams]);

  if (loading) return (
    <div id="loading">
      <div className="spinner-grow" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!data) return <div className="container"><div className="jumbotron"><p>Error loading details.</p></div></div>;

  const { jobFeats, resFeats, similarity_score, experience_match, education_match, skill_match, language_match, weights, is_admin } = data;

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

  const cellStyle = { color: 'black', fontSize: '15px', fontFamily: "'Barlow', sans-serif" };

  return (
    <div className="container">
      <div className="jumbotron">
        <img src="/images/information.png" height="50" style={{ display: 'block', margin: 'auto' }} alt="info" />
        <br />
        <h1 style={{ textAlign: 'center', color: 'black', fontSize: '30px', fontFamily: "'Barlow', sans-serif" }}>Job & Resume Details</h1>
        <hr />
        <br />
        <div className="row">
          <div className="col-md-6">
            <h3 style={{ textAlign: 'center', color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>Job Description Details</h3>
            <br />
            <table className="table table-striped">
              {jobRows.map(([label, value]) => (
                <tr className="table-light" key={label}><td style={cellStyle}>{label}</td><td style={cellStyle}>{value || 'Unknown'}</td></tr>
              ))}
            </table>
          </div>
          <div className="col-md-6">
            <h3 style={{ textAlign: 'center', color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>Resume Details</h3>
            <br />
            <table className="table table-striped">
              {resRows.map(([label, value]) => (
                <tr className="table-light" key={label}><td style={cellStyle}>{label}</td><td style={cellStyle}>{value || 'Unknown'}</td></tr>
              ))}
            </table>
          </div>
        </div>

        <br />
        <div className="alert alert-secondary">
          <h4 style={{ textAlign: 'center', color: 'black', fontSize: '20px', fontFamily: "'Barlow', sans-serif" }}>
            Overall Similarity Score: <strong>{similarity_score?.toFixed(2)}%</strong>
          </h4>
        </div>
        <br />
        <div className="row justify-content-center text-center">
          <div className="col-md-6">
            <h4 style={{ textAlign: 'center', color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>
              Score Breakdown {is_admin ? '(Customized Weights)' : '(Default Weights)'}
            </h4>
            <table className="table table-light table-bordered">
              <tbody>
                <tr>
                  <td style={cellStyle}>Experience Score</td><td style={cellStyle}>{experience_match?.toFixed(2)}%</td>
                  <td style={cellStyle}>Experience Weight</td><td style={cellStyle}>{weights?.experience?.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td style={cellStyle}>Education Score</td><td style={cellStyle}>{education_match?.toFixed(2)}%</td>
                  <td style={cellStyle}>Education Weight</td><td style={cellStyle}>{weights?.education?.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td style={cellStyle}>Skills Score</td><td style={cellStyle}>{skill_match?.toFixed(2)}%</td>
                  <td style={cellStyle}>Skill Weight</td><td style={cellStyle}>{weights?.skill?.toFixed(2)}%</td>
                </tr>
                <tr>
                  <td style={cellStyle}>Language Score</td><td style={cellStyle}>{language_match?.toFixed(2)}%</td>
                  <td style={cellStyle}>Language Weight</td><td style={cellStyle}>{weights?.language?.toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

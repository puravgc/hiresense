import { Link } from 'react-router-dom';

export default function Intro() {
  const downloadResume = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = '/docx/resume.docx';
    document.body.appendChild(iframe);
  };

  const downloadJob = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = '/docx/job.docx';
    document.body.appendChild(iframe);
  };

  return (
    <>
      {/* Banner */}
      <div className="position-relative">
        <img src="/images/ban2.jpg" className="img-fluid w-100" alt="Banner" />
        <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
          <img src="/images/skillSync9.png" style={{ width: '450px' }} alt="HireSense Instructions" />
        </div>
      </div>

      <div className="jumbotron" style={{ marginBottom: 0 }}>
        <p style={{ color: 'black', fontSize: '30px', fontFamily: "'Barlow', sans-serif", textAlign: 'center' }}>Welcome to the Instructions Page!</p>
        <hr />
        <p style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif", textAlign: 'justify' }}>
          In this page, we will go through a guide on how to use this application for the optimal results. Here are a list of things you should follow:
        </p>

        <div className="accordion accordion-flush" id="accordionFlush">
          {/* File Format */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-1" style={{ fontSize: '20px', fontFamily: "'Barlow', sans-serif" }}>File Format</button>
            </h2>
            <div id="flush-1" className="accordion-collapse collapse" data-bs-parent="#accordionFlush">
              <div className="accordion-body">
                <p style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif", textAlign: 'justify' }}>The file format of the resume or job description must be any one of the following:</p>
                <ol style={{ fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>
                  <li title="Portable Document Format">PDF</li>
                  <li title="Document File">DOCX</li>
                  <li title="Text File">TXT</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Resume Format */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-2" style={{ fontSize: '20px', fontFamily: "'Barlow', sans-serif" }}>Resume Format</button>
            </h2>
            <div id="flush-2" className="accordion-collapse collapse" data-bs-parent="#accordionFlush">
              <div className="accordion-body">
                <p style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif", textAlign: 'justify' }}>The resume file may be in any format. However to guarantee optimal results, the following format is desired:</p>
                <img className="rounded mx-auto d-block" src="/images/resumeSample.PNG" alt="Resume Sample" />
                <p style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif", textAlign: 'justify' }}>Here is the docx file for this format, if you want to structure your file in this format:</p>
                <button onClick={downloadResume} className="btn btn-dark btn-lg" style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Download Resume</button>
              </div>
            </div>
          </div>

          {/* Job Description Format */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-3" style={{ fontSize: '20px', fontFamily: "'Barlow', sans-serif" }}>Job Description Format</button>
            </h2>
            <div id="flush-3" className="accordion-collapse collapse" data-bs-parent="#accordionFlush">
              <div className="accordion-body">
                <p style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif", textAlign: 'justify' }}>The job description file may be in any format. However to guarantee optimal results, the following format is desired:</p>
                <img className="rounded mx-auto d-block" src="/images/jobSample.PNG" alt="Job Sample" />
                <p style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif", textAlign: 'justify' }}>Here is the docx file for this format, if you want to structure your file in this format:</p>
                <button onClick={downloadJob} className="btn btn-dark btn-lg" style={{ color: 'white', fontSize: '15px', fontFamily: "'Barlow', sans-serif" }}>Download Job Description</button>
              </div>
            </div>
          </div>

          {/* Customizable Weights */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-4" style={{ fontSize: '20px', fontFamily: "'Barlow', sans-serif" }}>Customizable Weights</button>
            </h2>
            <div id="flush-4" className="accordion-collapse collapse" data-bs-parent="#accordionFlush">
              <div className="accordion-body">
                <p style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif", textAlign: 'justify' }}>By default, the weights assigned to key features are as follows:</p>
                <table className="table table-hover" style={{ fontSize: '15px', fontFamily: "'Barlow', sans-serif", textAlign: 'justify' }}>
                  <thead><tr><th>Feature</th><th>Default Weight</th></tr></thead>
                  <tbody>
                    <tr><th>Experience</th><td>0.3</td></tr>
                    <tr><th>Education</th><td>0.2</td></tr>
                    <tr><th>Skills</th><td>0.4</td></tr>
                    <tr><th>Language</th><td>0.1</td></tr>
                  </tbody>
                </table>
                <p style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif", textAlign: 'justify' }}>Customizing feature weights is only accessible to admins. You need to login as the admin to administer any customization.</p>
              </div>
            </div>
          </div>

          {/* Get Started */}
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-5" style={{ fontSize: '20px', fontFamily: "'Barlow', sans-serif" }}>Get Started</button>
            </h2>
            <div id="flush-5" className="accordion-collapse collapse" data-bs-parent="#accordionFlush">
              <div className="accordion-body">
                <p style={{ color: 'black', fontSize: '18px', fontFamily: "'Barlow', sans-serif", textAlign: 'justify' }}>Now that you're familiar with the how tos. It's time to get started. Pick anything and begin the journey:</p>
                <ul className="list-group">
                  <li className="list-group-item"><Link to="/parse-resume" style={{ color: 'black', textDecoration: 'none', fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>Parse Resume</Link></li>
                  <li className="list-group-item"><Link to="/parse-job" style={{ color: 'black', textDecoration: 'none', fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>Parse Job Description</Link></li>
                  <li className="list-group-item"><Link to="/rank" style={{ color: 'black', textDecoration: 'none', fontSize: '18px', fontFamily: "'Barlow', sans-serif" }}>Rank</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div id="introCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {['intro2.jpg', 'intro3.jpg', 'intro4.jpg', 'intro5.jpg'].map((img, i) => (
            <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={img}>
              <img src={`/images/${img}`} className="d-block w-100" alt={`slide ${i + 1}`} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#introCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#introCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
}

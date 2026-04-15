import { useState } from "react";

export default function About() {
  const [openDesc, setOpenDesc] = useState(null);

  const devs = [
    {
      name: "Saujanya Shrestha",
      roll: "PAS077BCT036",
      contact: "9846602320",
      email: "sentake101@gmail.com",
      img: "SS.jpg",
    },
    {
      name: "Dipak Poudel",
      roll: "PAS077BCT019",
      contact: "",
      email: "",
      img: "DP.jpg",
    },
    {
      name: "Anish Dahal",
      roll: "PAS077BCT005",
      contact: "",
      email: "",
      img: "AD.jpg",
    },
    {
      name: "Saroj Adhikari",
      roll: "PAS077BCT035",
      contact: "",
      email: "",
      img: "SA.jpg",
    },
  ];

  return (
    <>
      {/* Banner */}
      <div className="position-relative">
        <img src="/images/ban3.jpg" className="img-fluid w-100" alt="Banner" />
        <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
          <img
            src="/images/skillSync11.png"
            style={{ width: "350px" }}
            alt="About Us"
          />
        </div>
      </div>

      <div className="jumbotron">
        <h1
          style={{
            color: "black",
            fontSize: "30px",
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          HireSense
        </h1>
        <hr />
        <p
          className="text-muted"
          style={{ fontSize: "18px", fontFamily: "'Barlow', sans-serif" }}
        >
          At <strong>HireSense</strong>, we bridge the gap between talent and
          opportunity using advanced{" "}
          <strong>Named Entity Recognition (NER)</strong> and AI-driven resume
          ranking. Our intelligent system analyzes resumes and job descriptions
          to deliver highly accurate candidate-job matching, ensuring recruiters
          find the best-fit applicants efficiently.
        </p>
        <br />
        <h1
          style={{
            color: "black",
            fontSize: "30px",
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          Our Mission
        </h1>
        <hr />
        <p
          className="text-muted"
          style={{ fontSize: "18px", fontFamily: "'Barlow', sans-serif" }}
        >
          We aim to revolutionize the hiring process by leveraging{" "}
          <strong>AI</strong> and{" "}
          <strong>Natural Language Processing (NLP)</strong> to provide fair,
          transparent, and data-driven resume evaluations. With HireSense,
          companies can reduce hiring time, improve candidate quality, and make
          informed decisions.
        </p>
        <br />
        <h3
          style={{
            color: "black",
            fontSize: "30px",
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          How HireSense Works
        </h3>
        <hr />
        <ol
          className="text-muted"
          style={{ fontSize: "18px", fontFamily: "'Barlow', sans-serif" }}
        >
          <li>
            <strong>NER-Powered Resume Parsing</strong>
          </li>
          <p>
            Extracts key skills, experiences, qualifications, and certifications
            from resumes.
          </p>
          <li>
            <strong>NER-Powered Job Description Parsing</strong>
          </li>
          <p>
            Extracts key skills, experiences, qualifications, and certifications
            from job descriptions.
          </p>
          <li>
            <strong>Job-Resume Comparing Algorithm</strong>
          </li>
          <p>
            Compares resumes against job descriptions to generate a match
            percentage.
          </p>
          <li>
            <strong>Ranking Resumes</strong>
          </li>
          <p>
            Recruiters get a prioritized list of top candidates based on
            relevance.
          </p>
        </ol>
        <br />
        <h1
          style={{
            color: "black",
            fontSize: "30px",
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          Why Choose HireSense?
        </h1>
        <hr />
        <ul
          className="text-muted"
          style={{ fontSize: "18px", fontFamily: "'Barlow', sans-serif" }}
        >
          <li>
            <strong>AI-Driven Precision</strong>
          </li>
          <p>Advanced NLP ensures accurate skill extraction and matching.</p>
          <li>
            <strong>Time-Saving Automation</strong>
          </li>
          <p>No more manual screening—HireSense does the heavy lifting.</p>
          <li>
            <strong>Fair &amp; Unbiased</strong>
          </li>
          <p>Focuses on skills and qualifications, reducing bias in hiring.</p>
        </ul>
        <br />
      </div>
    </>
  );
}

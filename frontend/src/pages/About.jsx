import { Link } from "react-router-dom";

const TEAM = [
  {
    name: "Purav G.C",
    roll: "79011900",
    img: "4.jpg",
    email: "sentake101@gmail.com",
  },
  {
    name: "Hitesh Bhatt",
    roll: "79011900",
    img: "4.jpg",
    contact: "",
    email: "",
  },
  {
    name: "Ishwor Sharma",
    roll: "79011900",
    img: "4.jpg",
    contact: "",
    email: "",
  },
];

const WHY = [
  {
    icon: "🧠",
    title: "AI-Driven Precision",
    desc: "Advanced NLP ensures accurate skill extraction and matching.",
  },
  {
    icon: "⚡",
    title: "Time-Saving Automation",
    desc: "No more manual screening — HireSense does the heavy lifting.",
  },
  {
    icon: "⚖️",
    title: "Fair & Unbiased",
    desc: "Focuses on skills and qualifications, reducing bias in hiring.",
  },
];

export default function About() {
  return (
    <div className="page-wide animate-up">
      <div className="page-header">
        <span className="page-icon">ℹ️</span>
        <h1 className="page-title">About HireSense</h1>
        <p className="page-subtitle">
          We bridge the gap between talent and opportunity using advanced NER
          and AI-driven resume ranking.
        </p>
      </div>
      <hr className="page-divider" />

      {/* Mission */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        <div className="card-dark">
          <div
            className="section-badge badge-purple"
            style={{ marginBottom: "0.85rem" }}
          >
            Our Mission
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.92rem",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            We aim to revolutionize the hiring process by leveraging{" "}
            <strong style={{ color: "#fff" }}>AI</strong> and{" "}
            <strong style={{ color: "#fff" }}>NLP</strong> to provide fair,
            transparent, and data-driven resume evaluations — reducing hiring
            time and improving candidate quality.
          </p>
        </div>
        <div className="card-dark">
          <div
            className="section-badge badge-green"
            style={{ marginBottom: "0.85rem" }}
          >
            How It Works
          </div>
          <ol
            style={{
              margin: 0,
              padding: "0 0 0 1.2rem",
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.88rem",
              lineHeight: 2,
            }}
          >
            <li>
              <strong style={{ color: "#fff" }}>
                NER-Powered Resume Parsing
              </strong>{" "}
              — extract skills, experience, education
            </li>
            <li>
              <strong style={{ color: "#fff" }}>Job Description Parsing</strong>{" "}
              — extract requirements from any JD
            </li>
            <li>
              <strong style={{ color: "#fff" }}>Comparison Algorithm</strong> —
              generate a match percentage
            </li>
            <li>
              <strong style={{ color: "#fff" }}>Ranked Shortlist</strong> — top
              candidates appear first
            </li>
          </ol>
        </div>
      </div>

      {/* Why Choose */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          Why HireSense
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {WHY.map((w, i) => (
            <div key={i} className="card-dark" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.7rem" }}>
                {w.icon}
              </div>
              <h4
                style={{
                  margin: "0 0 0.4rem",
                  color: "#fff",
                  fontFamily: "var(--font)",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                }}
              >
                {w.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.83rem",
                  lineHeight: 1.65,
                }}
              >
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          The Team
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {TEAM.map((dev, i) => (
            <div
              key={i}
              className="card-dark"
              style={{ textAlign: "center", padding: "1.5rem 1rem" }}
            >
              <img
                src={`/images/${dev.img}`}
                alt={dev.name}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  marginBottom: "0.75rem",
                  border: "2px solid rgba(108,99,255,0.35)",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.currentTarget.src = "/images/skillSync7.png";
                }}
              />
              <h4
                style={{
                  margin: "0 0 0.25rem",
                  color: "#fff",
                  fontFamily: "var(--font)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                {dev.name}
              </h4>
              <p
                style={{
                  margin: 0,
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "0.78rem",
                }}
              >
                {dev.roll}
              </p>
              {dev.contact && (
                <p
                  style={{
                    margin: "0.25rem 0 0",
                    color: "rgba(108,99,255,0.8)",
                    fontSize: "0.78rem",
                  }}
                >
                  {dev.contact}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

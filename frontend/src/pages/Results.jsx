import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import EmailModal from "../components/EmailModal";
import { useResults } from "../context/ResultsContext";

const scoreColor = (s) =>
  s >= 70 ? "#10b981" : s >= 40 ? "#f59e0b" : "#f87171";

export default function Results() {
  const location = useLocation();
  const { results: contextResults } = useResults();

  const data = contextResults || location.state || {};
  const rankedResumes = data.ranked_resumes || [];
  const jobPath = data.job_path || "";

  const [hirerProfile, setHirerProfile] = useState(null);
  const [emailTarget, setEmailTarget] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    API.get("/hirer/profile")
      .then((res) => setHirerProfile(res.data.profile))
      .catch(() => {});
  }, []);

  const handleSave = () => {
    if (isSaved || isSaving) return;
    setIsSaving(true);

    const jobTitle =
      jobPath
        .split(/[\\/]/)
        .pop()
        .replace(/\.[^/.]+$/, "") || "Untitled Hiring Session";

    API.post("/jobs/save", {
      job_title: jobTitle,
      job_path: jobPath,
      candidates: rankedResumes,
    })
      .then(() => {
        setIsSaved(true);
        alert("Hiring session saved to dashboard!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save session.");
      })
      .finally(() => setIsSaving(false));
  };

  const badges = ["🥇", "🥈", "🥉"];

  return (
    <div className="page-wide animate-up">
      {emailTarget && (
        <EmailModal
          candidate={emailTarget}
          hirerProfile={hirerProfile}
          onClose={() => setEmailTarget(null)}
        />
      )}

      <div className="page-header">
        <span className="page-icon">📊</span>
        <h1 className="page-title">Ranked Candidates</h1>
        <p className="page-subtitle">
          {rankedResumes.length} candidate
          {rankedResumes.length !== 1 ? "s" : ""} ranked by AI match score
        </p>

        {rankedResumes.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={handleSave}
              disabled={isSaving || isSaved}
              className={isSaved ? "btn-outline-dark" : "btn-primary-dark"}
              style={{ padding: "0.5rem 1.5rem", fontSize: "0.9rem" }}
            >
              {isSaving
                ? "Saving..."
                : isSaved
                  ? "✓ Saved to Dashboard"
                  : "💾 Save Shortlist"}
            </button>
          </div>
        )}
      </div>
      <hr className="page-divider" />

      {rankedResumes.length === 0 ? (
        <div
          className="alert-dark info"
          style={{ textAlign: "center", padding: "2rem" }}
        >
          No results found. Go back and try ranking again.
        </div>
      ) : (
        <div className="card-dark" style={{ padding: "0", overflow: "hidden" }}>
          <table className="dark-table">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th>Candidate</th>
                <th>Match Score</th>
                <th>Details</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {rankedResumes.map((resume, i) => {
                const color = scoreColor(resume.score);
                return (
                  <tr key={i}>
                    <td>
                      <span
                        style={{
                          fontSize: i < 3 ? "1.3rem" : "0.88rem",
                          color: i < 3 ? "" : "rgba(255,255,255,0.4)",
                          fontWeight: 700,
                        }}
                      >
                        {i < 3 ? badges[i] : `#${i + 1}`}
                      </span>
                    </td>
                    <td>
                      <strong>{resume.name}</strong>
                      {resume.is_reranked && (
                        <span
                          className="badge-purple"
                          style={{
                            fontSize: "0.65rem",
                            marginLeft: "0.5rem",
                            padding: "0.1rem 0.4rem",
                            verticalAlign: "middle",
                          }}
                        >
                          AI Reranked
                        </span>
                      )}
                      {resume.candidate_email && (
                        <div
                          style={{
                            fontSize: "0.78rem",
                            color: "rgba(255,255,255,0.38)",
                            marginTop: 2,
                          }}
                        >
                          {resume.candidate_email}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="score-bar-wrap">
                        <div className="score-bar-track">
                          <div
                            className="score-bar-fill"
                            style={{
                              width: `${Math.min(resume.score, 100)}%`,
                              background: color,
                            }}
                          />
                        </div>
                        <span className="score-val" style={{ color }}>
                          {resume.score.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <Link
                        to={`/view-details?job_path=${encodeURIComponent(jobPath)}&resume_path=${encodeURIComponent(resume.resume_path)}&exp=${resume.experience_match}&edu=${resume.education_match}&skill=${resume.skill_match}&lang=${resume.language_match}&score=${resume.score}`}
                        className="btn-outline-dark"
                        style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                      >
                        View Details
                      </Link>
                    </td>
                    <td>
                      <button
                        id={`email-btn-${i}`}
                        onClick={() =>
                          setEmailTarget({
                            name: resume.name,
                            email: resume.candidate_email,
                          })
                        }
                        className="btn-primary-dark"
                        style={{ fontSize: "0.8rem", padding: "0.4rem 0.9rem" }}
                      >
                        ✉ Email
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div
        className="btn-group-row"
        style={{ marginTop: "2rem", justifyContent: "center" }}
      >
        <Link to="/rank" className="btn-outline-dark">
          ← Rank Again
        </Link>
      </div>
    </div>
  );
}

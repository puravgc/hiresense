import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const STATUS_OPTIONS = [
  "Shortlisted",
  "Contacted",
  "Interviewing",
  "Hired",
  "Rejected",
];
const scoreColor = (s) =>
  s >= 70 ? "#10b981" : s >= 40 ? "#f59e0b" : "#f87171";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  useEffect(() => {
    API.get("/jobs")
      .then((res) => {
        setJobs(res.data.jobs);
        if (res.data.jobs.length > 0) {
          setSelectedJobId(res.data.jobs[0].id.toString());
          fetchCandidates(res.data.jobs[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(console.error);
  }, []);

  const fetchCandidates = (jobId) => {
    setLoadingCandidates(true);
    API.get(`/jobs/${jobId}/candidates`)
      .then((res) => setCandidates(res.data.candidates))
      .catch(console.error)
      .finally(() => {
        setLoadingCandidates(false);
        setLoading(false);
      });
  };

  const handleJobChange = (e) => {
    const id = e.target.value;
    setSelectedJobId(id);
    fetchCandidates(id);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;
    const candId = parseInt(draggableId);

    // Optimistic Update
    const updatedCandidates = candidates.map((c) =>
      c.id === candId ? { ...c, status: newStatus } : c,
    );
    setCandidates(updatedCandidates);

    // Backend
    API.post(`/candidates/${candId}/status`, { status: newStatus }).catch(
      (err) => {
        console.error(err);
        fetchCandidates(selectedJobId);
      },
    );
  };

  const handleDelete = async (candId) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await API.delete(`/candidates/${candId}`);
      setCandidates((prev) => prev.filter((c) => c.id !== candId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete candidate");
    }
  };


  if (loading)
    return (
      <div id="loading">
        <div className="loading-spinner" />
      </div>
    );

  const currentJob = jobs.find((j) => j.id.toString() === selectedJobId);

  return (
    <div
      style={{
        padding: "1.5rem",
        height: "calc(100vh - 10px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexShrink: 0,
        }}
      >
        <div style={{ textAlign: "left" }}>
          <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800 }}>
            Recruitment Pipeline
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Visual workflow for your hiring sessions.
          </p>
        </div>

        <div style={{ minWidth: "320px" }}>
          <select
            value={selectedJobId}
            onChange={handleJobChange}
            style={{
              width: "100%",
              padding: "0.8rem 1rem",
              outline: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "#ffffff",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {jobs.map((job) => (
              <option
                key={job.id}
                value={job.id}
                style={{ background: "#12122a", color: "#fff" }}
              >
                {job.title} — {new Date(job.created_at).toLocaleDateString()} (
                {job.candidate_count} candidates)
              </option>
            ))}
          </select>
        </div>
      </div>

      <style>{`
        .board-container::-webkit-scrollbar { height: 10px; width: 0px; }
        .board-container::-webkit-scrollbar-track { background: transparent; }
        .board-container::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.2); border-radius: 10px; }
        
        /* Internal Column Scrollbars */
        .column-scroll-container::-webkit-scrollbar { width: 6px; }
        .column-scroll-container::-webkit-scrollbar-track { background: rgba(255,255,255,0.01); }
        .column-scroll-container::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.15); border-radius: 10px; }
        .column-scroll-container::-webkit-scrollbar-thumb:hover { background: rgba(108,99,255,0.3); }

        .column-header { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; margin-bottom: 1rem; }
        .column-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.4); letter-spacing: 1.5px; }
        .column-pill { background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 20px; font-size: 0.7rem; color: rgba(255,255,255,0.3); }
        .cand-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.25rem; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: grab; }
        .cand-card:hover { border-color: var(--accent); background: rgba(108,99,255,0.05); transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
        .cand-card:active { cursor: grabbing; }
      `}</style>

      {loadingCandidates ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="loading-spinner" />
        </div>
      ) : candidates.length === 0 ? (
        <div
          className="card-dark"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderStyle: "dashed",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.3)" }}>
            No candidates in this session. Start by ranking resumes.
          </p>
          <Link
            to="/rank"
            className="btn-primary-dark"
            style={{ marginTop: "1.25rem" }}
          >
            Rank Resumes
          </Link>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div
            className="board-container"
            style={{
              display: "flex",
              gap: "1.5rem",
              overflowX: "auto",
              paddingBottom: "2rem",
              flex: 1,
              alignItems: "stretch",
            }}
          >
            {STATUS_OPTIONS.map((status) => (
              <div
                key={status}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "320px",
                  width: "320px",
                  background: "rgba(255,255,255,0.015)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.04)",
                  padding: "1rem",
                  maxHeight: "100%",
                }}
              >
                <div
                  className="column-header"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "rgba(9,9,26,0.95)",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    margin: 0,
                    padding: "1rem",
                  }}
                >
                  <span className="column-title">{status}</span>
                  <span className="column-pill">
                    {candidates.filter((c) => c.status === status).length}
                  </span>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="column-scroll-container"
                      style={{
                        background: snapshot.isDraggingOver
                          ? "rgba(108,99,255,0.05)"
                          : "transparent",

                        borderRadius: "0 0 12px 12px",
                        flex: 1,
                        padding: "1rem",
                        minHeight: "100px",
                        overflowY: "auto",
                        transition: "background 0.2s ease",
                      }}
                    >
                      {candidates
                        .filter((c) => c.status === status)
                        .map((cand, index) => (
                          <Draggable
                            key={cand.id.toString()}
                            draggableId={cand.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="cand-card"
                                style={{
                                  ...provided.draggableProps.style,
                                  marginBottom: "1rem",
                                  opacity: snapshot.isDragging ? 0.9 : 1,
                                  zIndex: snapshot.isDragging ? 1000 : 1,
                                  boxShadow: snapshot.isDragging
                                    ? "0 15px 35px rgba(0,0,0,0.6)"
                                    : "none",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      fontSize: "0.95rem",
                                      color: "#fff",
                                      flex: 1,
                                      paddingRight: "0.5rem"
                                    }}
                                  >
                                    {cand.name}
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                    <div
                                      style={{
                                        color: scoreColor(cand.score),
                                        fontSize: "0.78rem",
                                        fontWeight: 800,
                                        background: "rgba(0,0,0,0.3)",
                                        padding: "2px 8px",
                                        borderRadius: "6px",
                                        border: `1px solid ${scoreColor(cand.score)}33`,
                                      }}
                                    >
                                      {cand.score.toFixed(0)}%
                                    </div>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(cand.id);
                                      }}
                                      style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.3)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s',
                                        padding: 0
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(244,67,54,0.1)';
                                        e.currentTarget.style.color = '#f44336';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.3)';
                                      }}
                                      title="Delete Candidate"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "rgba(255,255,255,0.3)",
                                    marginTop: "0.3rem",
                                  }}
                                >
                                  {cand.email || "No email found"}
                                </div>

                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "0.5rem",
                                    marginTop: "1rem",
                                    padding: "0.75rem",
                                    background: "rgba(0,0,0,0.2)",
                                    borderRadius: "8px",
                                    fontSize: "0.65rem",
                                  }}
                                >
                                  <div
                                    style={{ color: "rgba(255,255,255,0.5)" }}
                                  >
                                    Exp:{" "}
                                    <span style={{ color: "#fff" }}>
                                      {cand.experience_match.toFixed(0)}%
                                    </span>
                                  </div>
                                  <div
                                    style={{ color: "rgba(255,255,255,0.5)" }}
                                  >
                                    Edu:{" "}
                                    <span style={{ color: "#fff" }}>
                                      {cand.education_match.toFixed(0)}%
                                    </span>
                                  </div>
                                  <div
                                    style={{ color: "rgba(255,255,255,0.5)" }}
                                  >
                                    Skill:{" "}
                                    <span style={{ color: "#fff" }}>
                                      {cand.skill_match.toFixed(0)}%
                                    </span>
                                  </div>
                                  <div
                                    style={{ color: "rgba(255,255,255,0.5)" }}
                                  >
                                    Lang:{" "}
                                    <span style={{ color: "#fff" }}>
                                      {cand.language_match.toFixed(0)}%
                                    </span>
                                  </div>
                                </div>

                                {cand.ai_summary && (
                                  <div style={{ 
                                    marginTop: '1rem', 
                                    padding: '0.75rem', 
                                    background: 'rgba(108,99,255,0.05)', 
                                    borderRadius: '8px',
                                    fontSize: '0.7rem',
                                    lineHeight: '1.4',
                                    color: 'rgba(255,255,255,0.7)',
                                    borderLeft: '2px solid var(--accent)'
                                  }}>
                                    <strong style={{ display: 'block', color: 'var(--accent)', fontSize: '0.65rem', marginBottom: '4px', textTransform: 'uppercase' }}>AI Insight</strong>
                                    {cand.ai_summary}
                                  </div>
                                )}

                                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>

                                  <Link
                                    to={`/view-details?job_path=${encodeURIComponent(currentJob?.job_path)}&resume_path=${encodeURIComponent(cand.resume_path)}&exp=${cand.experience_match || 0}&edu=${cand.education_match || 0}&skill=${cand.skill_match || 0}&lang=${cand.language_match || 0}&score=${cand.score}`}
                                    className="btn-outline-dark"
                                    style={{
                                      fontSize: "0.68rem",
                                      padding: "0.3rem 0.8rem",
                                      border: "1px solid rgba(108,99,255,0.3)",
                                      color: "var(--accent)",
                                    }}
                                  >
                                    View Logic
                                  </Link>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}

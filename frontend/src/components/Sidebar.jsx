import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link className="sidebar-brand" to="/dashboard">
          <img
            src="/images/skillSync7.png"
            alt="logo"
            className="sidebar-logo"
          />
          <span>HireSense</span>
        </Link>
      </div>

      <div className="sidebar-nav">
        <ul>
          <li className="nav-group-label">Main Menu</li>
          <li className={`nav-item ${isActive("/dashboard")}`}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span className="icon">📊</span>
              <span className="text">Dashboard</span>
            </NavLink>
          </li>
          <li className={`nav-item ${isActive("/rank")}`}>
            <NavLink
              to="/rank"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <span className="icon">🏆</span>
              <span className="text">Rank Resumes</span>
            </NavLink>
          </li>

          <li className="nav-group-label" style={{ marginTop: "1.5rem" }}>
            Tools
          </li>
          <li className={`nav-item ${isActive("/parse-resume")}`}>
            <Link to="/parse-resume" className="nav-link">
              <span className="icon">📄</span>
              <span className="text">Parse Resume</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/parse-job")}`}>
            <Link to="/parse-job" className="nav-link">
              <span className="icon">💼</span>
              <span className="text">Parse JD</span>
            </Link>
          </li>

          <li className="nav-group-label" style={{ marginTop: "1.5rem" }}>
            Help
          </li>
          <li className={`nav-item ${isActive("/intro")}`}>
            <Link to="/intro" className="nav-link">
              <span className="icon">📘</span>
              <span className="text">Instructions</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/about")}`}>
            <Link to="/about" className="nav-link">
              <span className="icon">ℹ️</span>
              <span className="text">About Us</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="admin-actions">
          {isAdmin ? (
            <Link
              to="/customize"
              className="btn-outline-dark"
              style={{ width: "100%", justifyContent: "center" }}
            >
              ⚙️ Customize Weights
            </Link>
          ) : (
            <Link
              to="/admin-login"
              className="btn-outline-dark"
              style={{
                width: "100%",
                justifyContent: "center",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              🔐 Admin Login
            </Link>
          )}
        </div>

        <div className="user-profile" style={{ marginTop: "1rem" }}>
          {user ? (
            <Link to="/login" className="profile-link">
              <img
                src={user.picture}
                alt="Profile"
                className="profile-pic-small"
              />
              <span
                className="profile-name"
                style={{ color: "#fff", fontSize: "0.85rem" }}
              >
                My Account
              </span>
            </Link>
          ) : (
            <a
              href="http://localhost:5000/api/google-login"
              className="btn-primary-dark"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}

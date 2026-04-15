import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css"; // We'll create this to keep styles scoped

export default function Sidebar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link className="sidebar-brand" to="/">
          <img src="/images/skillSync7.png" alt="logo" className="sidebar-logo" />
          <span>HireSense</span>
        </Link>
      </div>

      <div className="sidebar-nav">
        <ul>
          <li className={`nav-item ${isActive("/intro")}`}>
            <Link to="/intro" className="nav-link">
              <span className="icon">📖</span>
              <span className="text">Instruction</span>
            </Link>
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
              <span className="text">Parse Job Description</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/rank")}`}>
            <Link to="/rank" className="nav-link">
              <span className="icon">🏆</span>
              <span className="text">Rank</span>
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
            <Link to="/customize" className="btn-modern outline">
              Customize
            </Link>
          ) : (
            <Link to="/admin-login" className="btn-modern outline">
              Admin Login
            </Link>
          )}
        </div>

        <div className="user-profile">
          {user ? (
            <Link to="/login" className="profile-link">
              <img src={user.picture} alt="Profile" className="profile-pic-small" />
              <span className="profile-name">Settings</span>
            </Link>
          ) : (
            <Link to="/login" className="btn-modern filled">
              Login
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

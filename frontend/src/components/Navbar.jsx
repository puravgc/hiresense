import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
      <Link
        className="navbar-brand"
        to="/"
        style={{ fontFamily: "'Barlow', sans-serif" }}
      >
        <img
          src="/images/skillSync7.png"
          width="50"
          height="50"
          className="d-inline-block align-text-center"
          alt="logo"
        />{" "}
        HireSense
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className={`nav-item ${isActive("/intro")}`}>
            <Link
              className="nav-link"
              to="/intro"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Instruction
            </Link>
          </li>
          <li className={`nav-item ${isActive("/parse-resume")}`}>
            <Link
              className="nav-link"
              to="/parse-resume"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Parse Resume
            </Link>
          </li>
          <li className={`nav-item ${isActive("/parse-job")}`}>
            <Link
              className="nav-link"
              to="/parse-job"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Parse Job Description
            </Link>
          </li>
          <li className={`nav-item ${isActive("/rank")}`}>
            <Link
              className="nav-link"
              to="/rank"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Rank
            </Link>
          </li>
          <li className={`nav-item ${isActive("/about")}`}>
            <Link
              className="nav-link"
              to="/about"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              About Us
            </Link>
          </li>
        </ul>

        {isAdmin ? (
          <Link
            to="/customize"
            className="btn btn-outline-dark"
            style={{
              fontSize: "15px",
              fontFamily: "'Barlow', sans-serif",
              marginRight: "10px",
            }}
          >
            Customize
          </Link>
        ) : (
          <Link
            to="/admin-login"
            className="btn btn-outline-dark"
            style={{
              fontSize: "15px",
              fontFamily: "'Barlow', sans-serif",
              marginRight: "10px",
            }}
          >
            Admin Login
          </Link>
        )}

        {user ? (
          <Link to="/login">
            <img src={user.picture} alt="Profile" className="profile-pic" />
          </Link>
        ) : (
          <Link
            to="/login"
            className="btn btn-dark"
            style={{
              color: "white",
              fontSize: "15px",
              fontFamily: "'Barlow', sans-serif",
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

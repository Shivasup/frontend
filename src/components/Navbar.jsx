import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { clearAuth, getRole } from "../api/api";
import "./Navbar.css";

const roleLabel = {
  student: "Student",
  trainer: "Trainer",
  institution: "Institution",
  programme_manager: "Prog. Manager",
  monitoring_officer: "Monitoring Officer",
};

export default function Navbar() {
  const navigate = useNavigate();
  const role = getRole();

  function logout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span className="navbar-logo">⬡</span>
        <span className="navbar-name">SkillBridge</span>
      </Link>

      <div className="navbar-right">
        {role && (
          <span className={`badge badge-${role}`}>
            {roleLabel[role] || role}
          </span>
        )}
        <button className="btn btn-ghost" onClick={logout}>
          Sign out
        </button>
      </div>
    </nav>
  );
}

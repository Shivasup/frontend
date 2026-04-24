import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, saveAuth } from "../api/api";
import "../styles/auth.css";

const ROLES = [
  { value: "student",            label: "Student" },
  { value: "trainer",            label: "Trainer" },
  { value: "institution",        label: "Institution" },
  { value: "programme_manager",  label: "Programme Manager" },
  { value: "monitoring_officer", label: "Monitoring Officer" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.signup(form);
      saveAuth(data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-logo">⬡</span>
          <h1>SkillBridge</h1>
        </div>
        <p className="auth-tagline">
          Join the skilling programme and start tracking your progress.
        </p>
      </div>

      <div className="auth-right">
        <form className="auth-form card" onSubmit={handleSubmit}>
          <h2 className="auth-form-title">Create account</h2>
          <p className="auth-form-sub">Get started with SkillBridge</p>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account →"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/api";   // ✅ only api needed
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.login(form);   // ✅ token already saved inside api
      navigate("/dashboard");  // redirect after login
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
          State-level skilling programme<br />attendance management.
        </p>

        <div className="auth-features">
          {[
            "Role-based access control",
            "JWT authentication",
            "Real-time attendance tracking",
          ].map((f) => (
            <div key={f} className="auth-feature">
              <span className="auth-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <form className="auth-form card" onSubmit={handleSubmit}>
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-sub">Sign in to your account</p>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@skillbridge.in"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>

          <p className="auth-switch">
            No account? <Link to="/signup">Create one</Link>
          </p>

          <div className="auth-demo">
            <p className="auth-demo-label">Quick demo accounts</p>

            {[
              ["student", "aarav@student.in", "student1234"],
              ["trainer", "arjun@skillbridge.in", "trainer1234"],
              ["monitor", "monitor@skillbridge.in", "mo1234"],
            ].map(([label, email, pw]) => (
              <button
                key={label}
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: "0.78rem", padding: "6px 12px" }}
                onClick={() => setForm({ email, password: pw })}
              >
                {label}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
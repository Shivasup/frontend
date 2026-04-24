import React from "react";
import { useNavigate } from "react-router-dom";
import { getRole } from "../api/api";
import Navbar from "../components/Navbar";
import StudentPage from "./StudentPage";
import TrainerPage from "./TrainerPage";
import "../styles/dashboard.css";

export default function Dashboard() {
  const role = getRole();
  const navigate = useNavigate();

  if (!role) {
    navigate("/login");
    return null;
  }

  function renderContent() {
    switch (role) {
      case "student":           return <StudentPage />;
      case "trainer":           return <TrainerPage />;
      case "institution":       return <InstitutionView />;
      case "programme_manager": return <ManagerView />;
      case "monitoring_officer":return <MonitoringView />;
      default: return <div>Unknown role</div>;
    }
  }

  return (
    <div className="dashboard-shell">
      <Navbar />
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
}

// ── Institution View ──────────────────────────────────────────────────────────
import { api, getUserId } from "../api/api";

function InstitutionView() {
  const [batchId, setBatchId] = React.useState("");
  const [summary, setSummary] = React.useState(null);
  const [error, setError] = React.useState("");
  const [form, setForm] = React.useState({ name: "" });
  const [success, setSuccess] = React.useState("");

  const instId = getUserId();

  async function createBatch(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const b = await api.createBatch({ name: form.name, institution_id: instId });
      setSuccess(`Batch "${b.name}" created (ID: ${b.id})`);
      setForm({ name: "" });
    } catch (err) { setError(err.message); }
  }

  async function loadSummary(e) {
    e.preventDefault();
    setError(""); setSummary(null);
    try {
      const s = await api.batchSummary(batchId);
      setSummary(s);
    } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h1 className="page-title">Institution Dashboard</h1>
      <p className="page-subtitle">Manage batches and review attendance summaries.</p>

      <div className="dash-grid">
        <div className="card">
          <h3 className="card-title">Create Batch</h3>
          <form onSubmit={createBatch}>
            <div className="form-group">
              <label>Batch Name</label>
              <input value={form.name} onChange={e => setForm({ name: e.target.value })} placeholder="e.g. Python Batch A" required />
            </div>
            {success && <div className="success-msg">{success}</div>}
            {error && <div className="error-msg">{error}</div>}
            <button className="btn btn-primary" type="submit">Create →</button>
          </form>
        </div>

        <div className="card">
          <h3 className="card-title">Batch Summary</h3>
          <form onSubmit={loadSummary}>
            <div className="form-group">
              <label>Batch ID</label>
              <input value={batchId} onChange={e => setBatchId(e.target.value)} placeholder="UUID" required />
            </div>
            <button className="btn btn-primary" type="submit">Load →</button>
          </form>
          {summary && (
            <div className="summary-box">
              <div className="summary-stat"><span>Sessions</span><strong>{summary.total_sessions}</strong></div>
              <div className="summary-stat"><span>Students</span><strong>{summary.total_students}</strong></div>
              <div className="summary-stat"><span>Present</span><strong style={{color:"var(--green)"}}>{summary.present_count}</strong></div>
              <div className="summary-stat"><span>Rate</span><strong>{summary.attendance_rate}%</strong></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Manager View ──────────────────────────────────────────────────────────────
function ManagerView() {
  const [summary, setSummary] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function load() {
    setLoading(true); setError("");
    try { setSummary(await api.programmeSummary()); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <h1 className="page-title">Programme Manager</h1>
      <p className="page-subtitle">Programme-wide attendance overview.</p>
      <button className="btn btn-primary" onClick={load} disabled={loading}>
        {loading ? "Loading…" : "Load Programme Summary"}
      </button>
      {error && <div className="error-msg" style={{marginTop:12}}>{error}</div>}
      {summary && (
        <div className="card" style={{marginTop:20}}>
          <div className="summary-box">
            <div className="summary-stat"><span>Institutions</span><strong>{summary.total_institutions}</strong></div>
            <div className="summary-stat"><span>Batches</span><strong>{summary.total_batches}</strong></div>
            <div className="summary-stat"><span>Sessions</span><strong>{summary.total_sessions}</strong></div>
            <div className="summary-stat"><span>Students</span><strong>{summary.total_students}</strong></div>
            <div className="summary-stat"><span>Overall Rate</span><strong style={{color:"var(--green)"}}>{summary.overall_attendance_rate}%</strong></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Monitoring View ───────────────────────────────────────────────────────────
function MonitoringView() {
  const [apiKey, setApiKey] = React.useState("");
  const [records, setRecords] = React.useState(null);
  const [error, setError] = React.useState("");
  const [step, setStep] = React.useState("key"); // key | data

  async function getToken(e) {
    e.preventDefault();
    setError("");
    try {
      const t = await api.monitoringToken(apiKey);
      localStorage.setItem("sb_monitoring_token", t.access_token);
      setStep("data");
    } catch (err) { setError(err.message); }
  }

  async function loadData() {
    setError("");
    try {
      const data = await api.monitoringAttendance();
      setRecords(data);
    } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h1 className="page-title">Monitoring Officer</h1>
      <p className="page-subtitle">Read-only access across the entire programme.</p>

      {step === "key" && (
        <div className="card" style={{maxWidth:420}}>
          <h3 className="card-title">Enter API Key</h3>
          <form onSubmit={getToken}>
            <div className="form-group">
              <label>Monitoring API Key</label>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-monitoring-..." required />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button className="btn btn-primary" type="submit">Get Monitoring Token →</button>
          </form>
        </div>
      )}

      {step === "data" && (
        <div>
          <div className="success-msg" style={{marginBottom:16}}>✓ Monitoring token obtained (1h expiry)</div>
          <button className="btn btn-primary" onClick={loadData}>Load Attendance Records</button>
          {error && <div className="error-msg" style={{marginTop:12}}>{error}</div>}
          {records && (
            <div className="card" style={{marginTop:20, overflowX:"auto"}}>
              <table>
                <thead><tr><th>Student</th><th>Session</th><th>Status</th><th>Marked At</th></tr></thead>
                <tbody>
                  {records.slice(0,50).map(r => (
                    <tr key={r.attendance_id}>
                      <td>{r.student_name}</td>
                      <td>{r.session_id.slice(0,8)}…</td>
                      <td><span className={`badge badge-${r.status === "present" ? "trainer" : r.status === "absent" ? "monitoring_officer" : "institution"}`}>{r.status}</span></td>
                      <td>{new Date(r.marked_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{color:"var(--text-dim)",fontSize:"0.8rem",marginTop:10}}>Showing up to 50 records</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

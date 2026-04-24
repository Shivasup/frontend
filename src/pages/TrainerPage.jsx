import React, { useState } from "react";
import { api, getUserId } from "../api/api";
import "../styles/dashboard.css";

export default function TrainerPage() {
  const trainerId = getUserId();

  // Create Batch state
  const [batchForm, setBatchForm] = useState({ name: "", institution_id: "" });
  const [batchMsg, setBatchMsg] = useState({ type: "", text: "" });
  const [createdBatchId, setCreatedBatchId] = useState("");

  // Create Session state
  const [sessionForm, setSessionForm] = useState({
    title: "", date: "", start_time: "", end_time: "", batch_id: ""
  });
  const [sessionMsg, setSessionMsg] = useState({ type: "", text: "" });
  const [createdSessionId, setCreatedSessionId] = useState("");

  // Generate Invite state
  const [inviteBatchId, setInviteBatchId] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [inviteMsg, setInviteMsg] = useState({ type: "", text: "" });

  // View Attendance state
  const [viewSessionId, setViewSessionId] = useState("");
  const [attendanceList, setAttendanceList] = useState(null);
  const [attMsg, setAttMsg] = useState({ type: "", text: "" });

  async function createBatch(e) {
    e.preventDefault();
    setBatchMsg({ type: "", text: "" });
    try {
      const b = await api.createBatch(batchForm);
      setCreatedBatchId(b.id);
      setBatchMsg({ type: "success", text: `✓ Batch "${b.name}" created. ID: ${b.id}` });
      setBatchForm({ name: "", institution_id: "" });
    } catch (err) { setBatchMsg({ type: "error", text: err.message }); }
  }

  async function createSession(e) {
    e.preventDefault();
    setSessionMsg({ type: "", text: "" });
    try {
      const s = await api.createSession(sessionForm);
      setCreatedSessionId(s.id);
      setSessionMsg({ type: "success", text: `✓ Session "${s.title}" created. ID: ${s.id}` });
    } catch (err) { setSessionMsg({ type: "error", text: err.message }); }
  }

  async function generateInvite(e) {
    e.preventDefault();
    setInviteMsg({ type: "", text: "" });
    setInviteToken("");
    try {
      const inv = await api.createInvite(inviteBatchId);
      setInviteToken(inv.token);
      setInviteMsg({ type: "success", text: "✓ Invite token generated (7-day expiry)" });
    } catch (err) { setInviteMsg({ type: "error", text: err.message }); }
  }

  async function viewAttendance(e) {
    e.preventDefault();
    setAttMsg({ type: "", text: "" });
    setAttendanceList(null);
    try {
      const list = await api.getSessionAttendance(viewSessionId);
      setAttendanceList(list);
    } catch (err) { setAttMsg({ type: "error", text: err.message }); }
  }

  return (
    <div>
      <h1 className="page-title">Trainer Dashboard</h1>
      <p className="page-subtitle">Create batches, sessions, and manage attendance.</p>

      <div className="dash-grid">

        {/* Create Batch */}
        <div className="card">
          <h3 className="card-title">Create Batch</h3>
          <form onSubmit={createBatch}>
            <div className="form-group">
              <label>Batch Name</label>
              <input value={batchForm.name}
                onChange={e => setBatchForm({ ...batchForm, name: e.target.value })}
                placeholder="Python Batch A" required />
            </div>
            <div className="form-group">
              <label>Institution ID</label>
              <input value={batchForm.institution_id}
                onChange={e => setBatchForm({ ...batchForm, institution_id: e.target.value })}
                placeholder="UUID of institution" required />
            </div>
            {batchMsg.text && <div className={batchMsg.type === "error" ? "error-msg" : "success-msg"}>{batchMsg.text}</div>}
            <button className="btn btn-primary" type="submit">Create Batch →</button>
          </form>
        </div>

        {/* Create Session */}
        <div className="card">
          <h3 className="card-title">Create Session</h3>
          <form onSubmit={createSession}>
            <div className="form-group">
              <label>Title</label>
              <input value={sessionForm.title}
                onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })}
                placeholder="Intro to Python" required />
            </div>
            <div className="form-group">
              <label>Batch ID</label>
              <input value={sessionForm.batch_id}
                onChange={e => setSessionForm({ ...sessionForm, batch_id: e.target.value })}
                placeholder="UUID" required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={sessionForm.date}
                onChange={e => setSessionForm({ ...sessionForm, date: e.target.value })} required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" value={sessionForm.start_time}
                  onChange={e => setSessionForm({ ...sessionForm, start_time: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="time" value={sessionForm.end_time}
                  onChange={e => setSessionForm({ ...sessionForm, end_time: e.target.value })} required />
              </div>
            </div>
            {sessionMsg.text && <div className={sessionMsg.type === "error" ? "error-msg" : "success-msg"}>{sessionMsg.text}</div>}
            <button className="btn btn-primary" type="submit">Create Session →</button>
          </form>
        </div>

        {/* Generate Invite */}
        <div className="card">
          <h3 className="card-title">Generate Invite</h3>
          <form onSubmit={generateInvite}>
            <div className="form-group">
              <label>Batch ID</label>
              <input value={inviteBatchId}
                onChange={e => setInviteBatchId(e.target.value)}
                placeholder="UUID" required />
            </div>
            {inviteMsg.text && <div className={inviteMsg.type === "error" ? "error-msg" : "success-msg"}>{inviteMsg.text}</div>}
            {inviteToken && (
              <div className="token-display">
                <p>Share this token with students:</p>
                <code>{inviteToken}</code>
              </div>
            )}
            <button className="btn btn-primary" type="submit">Generate →</button>
          </form>
        </div>

        {/* View Attendance */}
        <div className="card">
          <h3 className="card-title">View Session Attendance</h3>
          <form onSubmit={viewAttendance}>
            <div className="form-group">
              <label>Session ID</label>
              <input value={viewSessionId}
                onChange={e => setViewSessionId(e.target.value)}
                placeholder="UUID" required />
            </div>
            {attMsg.text && <div className="error-msg">{attMsg.text}</div>}
            <button className="btn btn-primary" type="submit">Load →</button>
          </form>
          {attendanceList && (
            <div style={{ marginTop: 16, overflowX: "auto" }}>
              <table>
                <thead>
                  <tr><th>Student</th><th>Email</th><th>Status</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {attendanceList.map((r, i) => (
                    <tr key={i}>
                      <td>{r.student_name}</td>
                      <td>{r.student_email}</td>
                      <td>
                        <span className={`badge ${r.status === "present" ? "badge-trainer" : r.status === "absent" ? "badge-monitoring_officer" : "badge-institution"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>{new Date(r.marked_at).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

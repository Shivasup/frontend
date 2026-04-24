import React, { useState } from "react";
import { api } from "../api/api";
import "../styles/dashboard.css";

export default function StudentPage() {
  const [inviteToken, setInviteToken] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState("present");
  const [joinMsg, setJoinMsg] = useState({ type: "", text: "" });
  const [attMsg, setAttMsg] = useState({ type: "", text: "" });

  async function joinBatch(e) {
    e.preventDefault();
    setJoinMsg({ type: "", text: "" });
    try {
      const r = await api.joinBatch(inviteToken);
      setJoinMsg({ type: "success", text: `✓ Joined batch successfully!` });
      setInviteToken("");
    } catch (err) {
      setJoinMsg({ type: "error", text: err.message });
    }
  }

  async function markAttendance(e) {
    e.preventDefault();
    setAttMsg({ type: "", text: "" });
    try {
      await api.markAttendance({ session_id: sessionId, status });
      setAttMsg({ type: "success", text: `✓ Attendance marked as "${status}"` });
      setSessionId("");
    } catch (err) {
      setAttMsg({ type: "error", text: err.message });
    }
  }

  return (
    <div>
      <h1 className="page-title">Student Dashboard</h1>
      <p className="page-subtitle">Join batches and mark your session attendance.</p>

      <div className="dash-grid">
        {/* Join Batch */}
        <div className="card">
          <h3 className="card-title">Join a Batch</h3>
          <p className="card-desc">Paste the invite token you received from your trainer.</p>
          <form onSubmit={joinBatch}>
            <div className="form-group">
              <label>Invite Token</label>
              <input
                value={inviteToken}
                onChange={e => setInviteToken(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                required
              />
            </div>
            {joinMsg.text && (
              <div className={joinMsg.type === "error" ? "error-msg" : "success-msg"}>
                {joinMsg.text}
              </div>
            )}
            <button className="btn btn-primary" type="submit">Join Batch →</button>
          </form>
        </div>

        {/* Mark Attendance */}
        <div className="card">
          <h3 className="card-title">Mark Attendance</h3>
          <p className="card-desc">Enter the session ID and your attendance status.</p>
          <form onSubmit={markAttendance}>
            <div className="form-group">
              <label>Session ID</label>
              <input
                value={sessionId}
                onChange={e => setSessionId(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                required
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            {attMsg.text && (
              <div className={attMsg.type === "error" ? "error-msg" : "success-msg"}>
                {attMsg.text}
              </div>
            )}
            <button className="btn btn-primary" type="submit">Mark Attendance →</button>
          </form>
        </div>
      </div>
    </div>
  );
}

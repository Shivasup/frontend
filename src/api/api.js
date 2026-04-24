// ================= BASE URL =================
const BASE_URL = "https://skillbridge-dzb1.onrender.com";

// ================= TOKEN =================
function getToken() {
  return localStorage.getItem("sb_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ================= CORE REQUEST =================
async function request(method, path, body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.detail || `Error ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }

  return data;
}

// ================= API METHODS =================
export const api = {
  // -------- AUTH --------
  signup: (body) => request("POST", "/auth/signup", body),

  login: async (body) => {
  const data = await request("POST", "/auth/login", body);
  saveAuth(data.access_token);   // ✅ already saving
  return data;
},

  monitoringToken: (key) =>
    request("POST", "/auth/monitoring-token", { key }),

  // -------- BATCH --------
  createBatch: (body) =>
    request("POST", "/batches", body),

  createInvite: (batchId) =>
    request("POST", `/batches/${batchId}/invite`),

  joinBatch: (inviteToken) =>
    request("POST", "/batches/join", {
      invite_token: inviteToken,   // IMPORTANT
    }),

  // -------- SESSION --------
  createSession: (body) =>
    request("POST", "/sessions", body),

  getSessionAttendance: (id) =>
    request("GET", `/sessions/${id}/attendance`),

  // -------- ATTENDANCE --------
  markAttendance: (body) =>
    request("POST", "/attendance/mark", body),

  // -------- SUMMARY --------
  batchSummary: (id) =>
    request("GET", `/batches/${id}/summary`),

  institutionSummary: (id) =>
    request("GET", `/institutions/${id}/summary`),

  programmeSummary: () =>
    request("GET", "/programme/summary"),

  // -------- MONITORING --------
  monitoringAttendance: () =>
    request("GET", "/monitoring/attendance"),
};

// ================= TOKEN HELPERS =================
export function parseJWT(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function saveAuth(token) {
  localStorage.setItem("sb_token", token);
}

export function clearAuth() {
  localStorage.removeItem("sb_token");
}

export function getRole() {
  const token = getToken();
  if (!token) return null;
  return parseJWT(token)?.role || null;
}

export function getUserId() {
  const token = getToken();
  if (!token) return null;
  return parseJWT(token)?.sub || null;
}
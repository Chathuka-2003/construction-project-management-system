import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
});

// attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- helpers ----------
export function getAuth() {
  return {
    token: localStorage.getItem("token") || "",
    role: localStorage.getItem("role") || "",
    email: localStorage.getItem("email") || "",
    userId: localStorage.getItem("userId") || "",
    name: localStorage.getItem("name") || "",
  };
}

export function saveAuth({ token, role, email, userId, name }) {
  if (token) localStorage.setItem("token", token);
  if (role) localStorage.setItem("role", String(role).replace("ROLE_", ""));
  if (email) localStorage.setItem("email", email);

  if (userId !== undefined && userId !== null && String(userId).trim() !== "") {
    localStorage.setItem("userId", String(userId));
  }

  if (name) localStorage.setItem("name", String(name));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("userId");
  localStorage.removeItem("name");
}

// ---------- API ----------
export async function login(email, password) {
  const res = await api.post("/api/auth/login", { email, password });
  const payload = res?.data?.data;

  if (!payload?.token || !payload?.role || !payload?.userId) {
    throw new Error("Invalid login response from server");
  }

  return {
    token: payload.token,
    role: String(payload.role).replace("ROLE_", ""),
    email: payload.email || email,
    userId: payload.userId,
    name: payload.name || "",
  };
}

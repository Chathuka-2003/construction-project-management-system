// src/util/auth.js

export function setAuthSession({ token, user }) {
  if (token) localStorage.setItem("token", token);
  if (user) localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("customerId");
}

export function getCustomerIdFromStorage() {
  // ✅ always prefer stored user
  try {
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      const user = JSON.parse(userRaw);
      const id = user?.id || user?.userId || user?.customerId;
      if (id && !isNaN(Number(id))) return Number(id);
    }
  } catch {}

  // fallback direct
  const direct = localStorage.getItem("customerId") || localStorage.getItem("userId");
  if (direct && !isNaN(Number(direct))) return Number(direct);

  return null;
}

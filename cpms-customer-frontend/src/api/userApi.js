// src/api/userApi.js
import { api } from "./api";

// GET user by id
export async function getUserById(id) {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
}

// UPDATE user (PUT /api/users/{id})
export async function updateUser(id, payload) {
  const res = await api.put(`/api/users/${id}`, payload);
  return res.data;
}

// CHANGE PASSWORD (PATCH /api/users/{id}/password)
export async function changePassword(id, payload) {
  // payload: { currentPassword, newPassword, confirmPassword }
  const res = await api.patch(`/api/users/${id}/password`, payload);
  return res.data; // string message
}

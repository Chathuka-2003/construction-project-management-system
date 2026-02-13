// src/services/userService.js
import api from "./api";

const userService = {
  getAll: async () => {
    const res = await api.get("/api/users");
    return res.data; // backend returns List<UserResponseDTO>
  },

  getById: async (id) => {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
  },

  // ✅ ADMIN create user (backend: POST /api/admin/register/user)
  createAdminUser: async (payload) => {
    const res = await api.post("/api/admin/register/user", payload);
    // your backend sometimes returns raw DTO; sometimes wrapped
    return res?.data?.data ?? res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/api/users/${id}`, payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  },

  // ✅ patch status (we will add backend endpoint below)
  updateStatus: async (id, status) => {
    const res = await api.patch(`/api/users/${id}/status`, { status });
    return res.data;
  },
};

// ✅ optional named exports (if you like importing functions directly)
export const getAllUsers = userService.getAll;
export const createAdminUser = userService.createAdminUser;
export const updateUser = userService.update;
export const deleteUser = userService.remove;
export const patchUserStatus = userService.updateStatus;

export default userService;

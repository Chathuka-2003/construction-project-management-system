// src/api/projectApi.js
import { api } from "./api";   // ✅ correct import

export async function getProjectById(id) {
  const res = await api.get(`/api/projects/${id}`);
  return res.data;
}

export async function getAllProjects() {
  const res = await api.get(`/api/projects`);
  return res.data;
}

export async function getProjectsByCustomer(customerId) {
  const res = await api.get(`/api/projects/customer/${customerId}`);
  return res.data;
}

export async function getProjectsByManager(managerId) {
  const res = await api.get(`/api/projects/manager/${managerId}`);
  return res.data;
}

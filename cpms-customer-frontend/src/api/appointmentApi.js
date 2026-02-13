// src/api/appointmentApi.js
import { api } from "./api";

// GET /api/appointments/customer/{customerId}
export async function getAppointmentsByCustomer(customerId) {
  const res = await api.get(`/api/appointments/customer/${customerId}`);
  return res.data;
}

// POST /api/appointments
export async function createAppointment(payload) {
  const res = await api.post(`/api/appointments`, payload);
  return res.data;
}

import { api } from "./api";

// customer invoices
export async function getMyPayments() {
  const res = await api.get("/api/payments/my");
  return res.data;
}

// init payhere
export async function initPayHere(paymentId) {
  const res = await api.post(`/api/payments/${paymentId}/payhere/init`);
  return res.data; // PayHereInitResponse
}

// poll one payment
export async function getPaymentById(paymentId) {
  const res = await api.get(`/api/payments/${paymentId}`);
  return res.data;
}

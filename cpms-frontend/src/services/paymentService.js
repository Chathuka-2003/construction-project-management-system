import api from "./api";

const paymentService = {
  // Company: list by project
  getByProject: async (projectId) => {
    const res = await api.get(`/api/payments/project/${projectId}`);
    return res.data;
  },

  // Customer: list mine
  getMy: async () => {
    const res = await api.get("/api/payments/my");
    return res.data;
  },

  // Company: create invoice
  create: async (payload) => {
    const res = await api.post("/api/payments", payload);
    return res.data;
  },

  getOne: async (id) => {
    const res = await api.get(`/api/payments/${id}`);
    return res.data;
  },
};

export default paymentService;

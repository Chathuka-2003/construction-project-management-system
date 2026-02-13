import api from "./api";

const workerService = {
  getAll: async () => {
    const res = await api.get("/api/workers");
    return res.data;
  },

  create: async (payload) => {
    const res = await api.post("/api/workers", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await api.put(`/api/workers/${id}`, payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await api.delete(`/api/workers/${id}`);
    return res.data;
  },
};

export default workerService;

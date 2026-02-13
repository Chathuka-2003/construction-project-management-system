import { api } from "./api";
import { normalizeUrl } from "./fileApi";

export async function getCustomerProjects(customerId) {
  const res = await api.get(`/api/projects/customer/${customerId}`);
  return res.data;
}

export async function getProjectMessages(projectId) {
  const res = await api.get(`/api/chat/project/${projectId}`);
  const arr = Array.isArray(res.data) ? res.data : [];

  return arr.map((m) => {
    const fu = m?.fileUrl || m?.file?.fileUrl;
    if (fu) {
      const full = normalizeUrl(fu);
      if (m.fileUrl) m.fileUrl = full;
      if (m.file?.fileUrl) m.file.fileUrl = full;
    }
    return m;
  });
}

export async function sendMessage(dto) {
  const res = await api.post(`/api/chat/send`, dto);
  return res.data;
}

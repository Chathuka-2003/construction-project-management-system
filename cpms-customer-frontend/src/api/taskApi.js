import { api } from "./api";

export async function getTasksByProject(projectId) {
  const res = await api.get(`/api/tasks/project/${projectId}`);
  return res.data;
}

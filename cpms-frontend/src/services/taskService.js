import api from "./api";

const ENDPOINTS = {
  getAll: "/api/tasks",
  getByProject: (projectId) => `/api/tasks/project/${projectId}`,
  getById: (id) => `/api/tasks/${id}`,
  create: "/api/tasks",
  update: (id) => `/api/tasks/${id}`,
  delete: (id) => `/api/tasks/${id}`,
};

// ✅ unwrap helper (supports both: direct list or {data: ...})
function unwrap(res) {
  const d = res?.data;
  return d?.data ?? d;
}

export const taskService = {
  /**
   * Get all tasks
   */
  async getAll() {
    try {
      const res = await api.get(ENDPOINTS.getAll);
      const data = unwrap(res);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching all tasks:", error);
      throw error;
    }
  },

  /**
   * Get tasks by project
   */
  async getByProject(projectId) {
    try {
      const res = await api.get(ENDPOINTS.getByProject(projectId));
      const data = unwrap(res);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      throw error;
    }
  },

  /**
   * Get one task
   */
  async getById(id) {
    try {
      const res = await api.get(ENDPOINTS.getById(id));
      return unwrap(res);
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create task (TaskCreateDTO)
   * @param {object} taskData { title, progress, projectId, assignedToId }
   */
  async create(taskData) {
    try {
      // ✅ enforce backend DTO shape
      const payload = {
        title: String(taskData?.title ?? "").trim(),
        progress: Number(taskData?.progress ?? 0),
        projectId: Number(taskData?.projectId),
        assignedToId:
          taskData?.assignedToId === null || taskData?.assignedToId === undefined || taskData?.assignedToId === ""
            ? null
            : Number(taskData.assignedToId),
      };

      const res = await api.post(ENDPOINTS.create, payload);
      return unwrap(res);
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  /**
   * Update task (TaskUpdateDTO) - FULL BODY REQUIRED by your backend
   * @param {number} id
   * @param {object} taskData { title, progress, projectId, assignedToId }
   */
  async update(id, taskData) {
    try {
      // ✅ TaskUpdateDTO requires all fields (title, progress, projectId)
      const payload = {
        title: String(taskData?.title ?? "").trim(),
        progress: Number(taskData?.progress ?? 0),
        projectId: Number(taskData?.projectId),
        assignedToId:
          taskData?.assignedToId === null || taskData?.assignedToId === undefined || taskData?.assignedToId === ""
            ? null
            : Number(taskData.assignedToId),
      };

      const res = await api.put(ENDPOINTS.update(id), payload);
      return unwrap(res);
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete task
   */
  async delete(id) {
    try {
      await api.delete(ENDPOINTS.delete(id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },
};

export default taskService;

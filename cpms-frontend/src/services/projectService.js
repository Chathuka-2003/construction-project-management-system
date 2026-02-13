import api from "./api";

const ENDPOINTS = {
  getAll: "/api/projects",
  getByCustomer: (customerId) => `/api/projects/customer/${customerId}`,
  getByManager: (managerId) => `/api/projects/manager/${managerId}`,
  getById: (id) => `/api/projects/${id}`,
  create: "/api/projects",
  update: (id) => `/api/projects/${id}`,
  delete: (id) => `/api/projects/${id}`,
};

export const projectService = {
  /**
   * Get all projects (Admin only)
   */
  async getAll() {
    try {
      const response = await api.get(ENDPOINTS.getAll);
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      console.error("Error fetching all projects:", error);
      throw error;
    }
  },

  /**
   * Get projects by customer ID (Customer dashboard)
   * @param {number} customerId
   */
  async getByCustomer(customerId) {
    try {
      const response = await api.get(ENDPOINTS.getByCustomer(customerId));
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      console.error(`Error fetching projects for customer ${customerId}:`, error);
      throw error;
    }
  },

  /**
   * Get projects by manager/staff ID (Manager/Staff dashboard)
   * @param {number} managerId
   */
  async getByManager(managerId) {
    try {
      const response = await api.get(ENDPOINTS.getByManager(managerId));
      return Array.isArray(response.data) ? response.data : response.data?.data || [];
    } catch (error) {
      console.error(`Error fetching projects for manager ${managerId}:`, error);
      throw error;
    }
  },

  /**
   * Get single project by ID
   * @param {number} id
   */
  async getById(id) {
    try {
      const response = await api.get(ENDPOINTS.getById(id));
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new project
   * @param {object} projectData - { name, description, startDate, endDate, budget, status, customerId, managerId }
   */
  async create(projectData) {
    try {
      const response = await api.post(ENDPOINTS.create, projectData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  /**
   * Update project
   * @param {number} id
   * @param {object} projectData - partial update allowed
   */
  async update(id, projectData) {
    try {
      const response = await api.put(ENDPOINTS.update(id), projectData);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete project
   * @param {number} id
   */
  async delete(id) {
    try {
      await api.delete(ENDPOINTS.delete(id));
      return { success: true };
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  },
};

export default projectService;

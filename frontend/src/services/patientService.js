import api from './api';

export const patientService = {
  // Check health
  async checkHealth() {
    const response = await api.get('/health');
    return response.data;
  },

  // Get system options (genders, wards, departments, doctors)
  async getOptions() {
    const response = await api.get('/options');
    return response.data;
  },

  // Get patients with search, filters, pagination
  async getPatients(params = {}) {
    const response = await api.get('/patients', { params });
    return response.data;
  },

  // Get patient by ID or code
  async getPatient(id) {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  // Create new patient
  async createPatient(patientData) {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  // Update existing patient
  async updatePatient(id, patientData) {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data;
  },

  // Discharge patient
  async dischargePatient(id) {
    const response = await api.patch(`/patients/${id}/discharge`);
    return response.data;
  },

  // Delete patient
  async deletePatient(id) {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  },

  // Get dynamic dashboard stats
  async getDashboardStats() {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

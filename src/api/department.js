import { api } from "./index.js";

// Create a new department (Admin only)
export const createDepartment = (data) => {
  return api.post('/department/create', data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Get all departments with filters
export const getAllDepartments = (params = {}) => {
  return api.get('/department', { params });
};

// Get departments by municipality
export const getDepartmentsByMunicipality = (municipalityId) => {
  return api.get(`/department/municipality/${municipalityId}`);
};

// Get departments by category
export const getDepartmentsByCategory = (category) => {
  return api.get(`/department/category/${category}`);
};

// Get department by ID
export const getDepartmentById = (departmentId) => {
  return api.get(`/department/${departmentId}`);
};

// Get department analytics (Staff/Admin only)
export const getDepartmentAnalytics = (departmentId) => {
  return api.get(`/department/${departmentId}/analytics`);
};

// Update department (Admin only)
export const updateDepartment = (departmentId, data) => {
  return api.patch(`/department/${departmentId}`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Delete department (Admin only)
export const deleteDepartment = (departmentId) => {
  return api.delete(`/department/${departmentId}`);
};

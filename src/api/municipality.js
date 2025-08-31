import { api } from "./index.js";

// Create a new municipality (Admin only)
export const createMunicipality = (data) => {
  return api.post('/municipalities/create', data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Get all municipalities with filters
export const getAllMunicipalities = (params = {}) => {
  return api.get('/municipalities', { params });
};

// Get specific municipality by ID
export const getMunicipalityById = (municipalityId) => {
  return api.get(`/municipalities/${municipalityId}`);
};

// Get municipalities near a location
export const getMunicipalitiesNearLocation = (params = {}) => {
  return api.get('/municipalities/near', { params });
};

// Update municipality (Admin only)
export const updateMunicipality = (municipalityId, data) => {
  return api.patch(`/municipalities/${municipalityId}`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Delete municipality (Admin only)
export const deleteMunicipality = (municipalityId) => {
  return api.delete(`/municipalities/${municipalityId}`);
};

// Add department to municipality (Admin only)
export const addDepartmentToMunicipality = (municipalityId, departmentId) => {
  return api.post(`/municipalities/${municipalityId}/departments/${departmentId}`);
};

// Remove department from municipality (Admin only)
export const removeDepartmentFromMunicipality = (municipalityId, departmentId) => {
  return api.delete(`/municipalities/${municipalityId}/departments/${departmentId}`);
};

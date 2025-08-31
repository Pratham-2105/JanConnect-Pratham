import { api } from "./index.js";

// Create a new municipality (Admin only)
export const createMunicipality = (data) => {
  return api.post('/municipality/create', data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Get all municipalities with filters
export const getAllMunicipalities = (params = {}) => {
  return api.get('/municipality', { params });
};

// Get specific municipality by ID
export const getMunicipalityById = (municipalityId) => {
  return api.get(`/municipality/${municipalityId}`);
};

// Get municipalities near a location
export const getMunicipalitiesNearLocation = (params = {}) => {
  return api.get('/municipality/near', { params });
};

// Update municipality (Admin only)
export const updateMunicipality = (municipalityId, data) => {
  return api.patch(`/municipality/${municipalityId}`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Delete municipality (Admin only)
export const deleteMunicipality = (municipalityId) => {
  return api.delete(`/municipality/${municipalityId}`);
};

// Add department to municipality (Admin only)
export const addDepartmentToMunicipality = (municipalityId, departmentId) => {
  return api.post(`/municipality/${municipalityId}/departments/${departmentId}`);
};

// Remove department from municipality (Admin only)
export const removeDepartmentFromMunicipality = (municipalityId, departmentId) => {
  return api.delete(`/municipality/${municipalityId}/departments/${departmentId}`);
};

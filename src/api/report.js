import { api } from "./index.js";

export const createReport = (formData) => {
  return api.post('/reports/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getAllReports = (params = {}) => {
  return api.get('/reports', { params });
};

export const getReportById = (reportId) => {
  return api.get(`/reports/${reportId}`);
};

export const getUserReports = (params = {}) => {
  return api.get('/reports/user/me', { params });
};

export const upvoteReport = (reportId) => {
  return api.post(`/reports/${reportId}/upvote`);
};

export const removeUpvote = (reportId) => {
  return api.delete(`/reports/${reportId}/upvote`);
};

export const addFeedback = (reportId, data) => {
  return api.post(`/reports/${reportId}/feedback`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Staff/Admin only
export const updateReportStatus = (reportId, data) => {
  return api.patch(`/reports/${reportId}/status`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Staff/Admin only
export const getReportsAnalytics = (params = {}) => {
  return api.get('/reports/analytics', { params });
};

//admin only
export const deleteReport = (reportId) => {
  return api.delete(`/reports/${reportId}`);
};

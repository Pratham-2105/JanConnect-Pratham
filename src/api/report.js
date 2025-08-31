import { api } from "./index.js";

export const createReport = (formData) => {
  return api.post('/report/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getAllReports = (params = {}) => {
  return api.get('/report', { params });
};

export const getReportById = (reportId) => {
  return api.get(`/report/${reportId}`);
};

export const getUserReports = (params = {}) => {
  return api.get('/report/user/me', { params });
};

export const upvoteReport = (reportId) => {
  return api.post(`/report/${reportId}/upvote`);
};

export const removeUpvote = (reportId) => {
  return api.delete(`/report/${reportId}/upvote`);
};

export const addFeedback = (reportId, data) => {
  return api.post(`/report/${reportId}/feedback`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Staff/Admin only
export const updateReportStatus = (reportId, data) => {
  return api.patch(`/report/${reportId}/status`, data, {
    headers: { "Content-Type": "application/json" },
  });
};

// Staff/Admin only
export const getReportsAnalytics = (params = {}) => {
  return api.get('/report/analytics', { params });
};

//admin only
export const deleteReport = (reportId) => {
  return api.delete(`/report/${reportId}`);
};

import {api} from "./index.js"

export const registerUser = (formData) => {
  return api.post('/user/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const loginUser = (data) => api.post('/user/login', data);
export const getCurrentUser = () => api.get('/user/current-user');
export const logoutUser = () => api.post('/user/logout');
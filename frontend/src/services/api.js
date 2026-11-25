import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Centralized response interceptor for error normalization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected network error occurred.';
    if (error.response) {
      if (error.response.data && error.response.data.detail) {
        message = error.response.data.detail;
      } else if (error.response.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.response.status >= 500) {
        message = 'Internal server error. Please try again later.';
      }
    } else if (error.request) {
      message = 'Cannot reach backend server. Please check your connection.';
    }
    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default api;

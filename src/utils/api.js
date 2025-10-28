import axios from 'axios';
import { baseUrl } from './constants';

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Create axios instance
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('adminRefreshToken');
      
      if (refreshToken) {
        try {
          // Call refresh token API
          const formData = new FormData();
          formData.append('refresh_token', refreshToken);

          const response = await axios.post(`${baseUrl}/client/admin/refresh-token`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data.status) {
            const newToken = response.data.data.access_token;
            localStorage.setItem('adminToken', newToken);
            
            // Process queued requests
            processQueue(null, newToken);
            isRefreshing = false;
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear storage and redirect to login
          processQueue(refreshError, null);
          isRefreshing = false;
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRefreshToken');
          localStorage.removeItem('adminUser');
          window.location.href = '/admin/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        processQueue(error, null);
        isRefreshing = false;
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  // Login
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await axios.post(`${baseUrl}/client/admin/login`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const formData = new FormData();
    formData.append('refresh_token', refreshToken);

    const response = await axios.post(`${baseUrl}/client/admin/refresh-token`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/client/admin/profile');
    return response.data;
  },

  // Logout
  logout: async () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
  },
};

// PPF API methods
export const ppfAPI = {
  // Get all PPF records
  getPPFs: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'created_at',
      sort_order: params.sort_order || 'desc',
    });
    const response = await apiClient.get(`/client/admin/ppf?${queryParams}`);
    return response.data;
  },

  // Get single PPF record
  getPPF: async (id) => {
    const response = await apiClient.get(`/client/admin/ppf/${id}`);
    return response.data;
  },
};

// DRF API methods
export const drfAPI = {
  // Get all DRF records
  getDRFs: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'created_at',
      sort_order: params.sort_order || 'desc',
    });
    const response = await apiClient.get(`/client/admin/drf?${queryParams}`);
    return response.data;
  },

  // Get single DRF record
  getDRF: async (id) => {
    const response = await apiClient.get(`/client/admin/drf/${id}`);
    return response.data;
  },
};

export default apiClient;

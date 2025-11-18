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
    // If data is FormData, let browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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
    if (params.start_date) {
      queryParams.append('start_date', params.start_date);
    }
    if (params.end_date) {
      queryParams.append('end_date', params.end_date);
    }
    const response = await apiClient.get(`/client/admin/ppf?${queryParams}`);
    return response.data;
  },

  // Get single PPF record
  getPPF: async (id) => {
    const response = await apiClient.get(`/client/admin/ppf/${id}`);
    return response.data;
  },

  // Export PPF records
  exportPPFs: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'created_at',
      sort_order: params.sort_order || 'desc',
    });
    if (params.start_date) {
      queryParams.append('start_date', params.start_date);
    }
    if (params.end_date) {
      queryParams.append('end_date', params.end_date);
    }
    const response = await apiClient.get(`/client/admin/ppf/export?${queryParams}`, {
      responseType: 'blob',
    });
    return response;
  },

  // Delete single PPF
  deletePPF: async (id) => {
    const response = await apiClient.delete(`/client/admin/ppf/${id}`);
    return response.data;
  },

  // Bulk delete PPFs
  bulkDeletePPFs: async (ids = []) => {
    const response = await apiClient.post(`/client/admin/ppf/bulk`, { data: { ids } });
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
      conference_filter: params.conference_filter || '9th_conference',
    });
    if (params.start_date) {
      queryParams.append('start_date', params.start_date);
    }
    if (params.end_date) {
      queryParams.append('end_date', params.end_date);
    }
    if (params.payment_status && params.payment_status !== 'all') {
      queryParams.append('payment_status', params.payment_status);
    }
    const response = await apiClient.get(`/client/admin/drf?${queryParams}`);
    return response.data;
  },

  // Get single DRF record
  getDRF: async (id) => {
    const response = await apiClient.get(`/client/admin/drf/${id}`);
    return response.data;
  },

  // Export DRF records
  exportDRFs: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'created_at',
      sort_order: params.sort_order || 'desc',
      conference_filter: params.conference_filter || '9th_conference',
    });
    if (params.start_date) {
      queryParams.append('start_date', params.start_date);
    }
    if (params.end_date) {
      queryParams.append('end_date', params.end_date);
    }
    if (params.payment_status && params.payment_status !== 'all') {
      queryParams.append('payment_status', params.payment_status);
    }
    // Add selected IDs if provided
    if (params.selected_ids && Array.isArray(params.selected_ids) && params.selected_ids.length > 0) {
      params.selected_ids.forEach(id => {
        queryParams.append('selected_ids[]', id);
      });
    }
    const response = await apiClient.get(`/client/admin/drf/export?${queryParams}`, {
      responseType: 'blob',
    });
    return response;
  },

  // Update single DRF
  updateDRF: async (id, data) => {
    const response = await apiClient.put(`/client/admin/drf/${id}`, data);
    return response.data;
  },

  // Delete single DRF
  deleteDRF: async (id) => {
    const response = await apiClient.delete(`/client/admin/drf/${id}`);
    return response.data;
  },

  // Bulk delete DRFs
  bulkDeleteDRFs: async (ids = []) => {
    const response = await apiClient.post(`/client/admin/drf/bulk`, { ids });
    return response.data;
  },
};

// Banner API methods
export const bannerAPI = {
  getBanners: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'sort_order',
      sort_order: params.sort_order || 'asc',
    });
    if (params.is_active !== undefined && params.is_active !== null) {
      queryParams.append('is_active', params.is_active);
    }
    const response = await apiClient.get(`/client/admin/banners?${queryParams}`);
    return response.data;
  },

  getBanner: async (id) => {
    const response = await apiClient.get(`/client/admin/banners/${id}`);
    return response.data;
  },

  createBanner: async ({ title, imageFile, link_url, is_active = true, sort_order = 0, starts_at, ends_at }) => {
    const formData = new FormData();
    formData.append('title', title || '');
    // Ensure imageFile is a File object before appending
    if (imageFile && imageFile instanceof File) {
      formData.append('image', imageFile);
    }
    if (link_url) formData.append('link_url', link_url);
    formData.append('is_active', is_active ? '1' : '0');
    formData.append('sort_order', String(sort_order));
    if (starts_at) formData.append('starts_at', starts_at);
    if (ends_at) formData.append('ends_at', ends_at);
    // Don't set Content-Type header - let axios/browser set it with boundary
    // Note: Image files appear as "(binary)" in network inspectors - this is normal
    const response = await apiClient.post(`/client/admin/banners`, formData);
    return response.data;
  },

  updateBanner: async (id, { title, imageFile, link_url, is_active, sort_order, starts_at, ends_at }) => {
    const formData = new FormData();
    if (title !== undefined) formData.append('title', title);
    // Only append image if it's a File object (not null/undefined)
    if (imageFile && imageFile instanceof File) {
      formData.append('image', imageFile);
    }
    if (link_url !== undefined) formData.append('link_url', link_url || '');
    if (is_active !== undefined) formData.append('is_active', is_active ? '1' : '0');
    if (sort_order !== undefined) formData.append('sort_order', String(sort_order));
    if (starts_at !== undefined) formData.append('starts_at', starts_at || '');
    if (ends_at !== undefined) formData.append('ends_at', ends_at || '');
    // Don't set Content-Type header - let axios/browser set it with boundary
    // Note: Image files appear as "(binary)" in network inspectors - this is normal
    const response = await apiClient.put(`/client/admin/banners/${id}`, formData);
    return response.data;
  },

  deleteBanner: async (id) => {
    const response = await apiClient.delete(`/client/admin/banners/${id}`);
    return response.data;
  },

  bulkDeleteBanners: async (ids = []) => {
    const response = await apiClient.delete(`/client/admin/banners/bulk`, { data: { ids } });
    return response.data;
  },
};

// Event API methods
export const eventAPI = {
  getEvents: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'sort_order',
      sort_order: params.sort_order || 'asc',
    });
    if (params.is_active !== undefined && params.is_active !== null) {
      queryParams.append('is_active', params.is_active);
    }
    if (params.event_type) {
      queryParams.append('event_type', params.event_type);
    }
    const response = await apiClient.get(`/client/admin/events?${queryParams}`);
    return response.data;
  },

  getEvent: async (id) => {
    const response = await apiClient.get(`/client/admin/events/${id}`);
    return response.data;
  },

  createEvent: async ({ title, location, event_date, event_date_end, description, link_url, event_type, is_active = true, sort_order = 0, starts_at, ends_at }) => {
    const response = await apiClient.post(`/client/admin/events`, {
      title,
      location,
      event_date,
      event_date_end,
      description,
      link_url,
      event_type,
      is_active,
      sort_order,
      starts_at,
      ends_at,
    });
    return response.data;
  },

  updateEvent: async (id, { title, location, event_date, event_date_end, description, link_url, event_type, is_active, sort_order, starts_at, ends_at }) => {
    const response = await apiClient.put(`/client/admin/events/${id}`, {
      title,
      location,
      event_date,
      event_date_end,
      description,
      link_url,
      event_type,
      is_active,
      sort_order,
      starts_at,
      ends_at,
    });
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await apiClient.delete(`/client/admin/events/${id}`);
    return response.data;
  },

  bulkDeleteEvents: async (ids = []) => {
    const response = await apiClient.delete(`/client/admin/events/bulk`, { data: { ids } });
    return response.data;
  },
};

// Partner API methods
export const partnerAPI = {
  getPartners: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'sort_order',
      sort_order: params.sort_order || 'asc',
    });
    if (params.is_active !== undefined && params.is_active !== null) {
      queryParams.append('is_active', params.is_active);
    }
    const response = await apiClient.get(`/client/admin/partners?${queryParams}`);
    return response.data;
  },

  getPartner: async (id) => {
    const response = await apiClient.get(`/client/admin/partners/${id}`);
    return response.data;
  },

  createPartner: async ({ name, logoFile, subtitle, link_url, is_active = true, sort_order = 0 }) => {
    const formData = new FormData();
    formData.append('name', name || '');
    if (logoFile) formData.append('logo', logoFile);
    if (subtitle) formData.append('subtitle', subtitle);
    if (link_url) formData.append('link_url', link_url);
    formData.append('is_active', is_active ? '1' : '0');
    formData.append('sort_order', String(sort_order));
    const response = await apiClient.post(`/client/admin/partners`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updatePartner: async (id, { name, logoFile, subtitle, link_url, is_active, sort_order }) => {
    const formData = new FormData();
    if (name !== undefined) formData.append('name', name);
    if (logoFile) formData.append('logo', logoFile);
    if (subtitle !== undefined) formData.append('subtitle', subtitle);
    if (link_url !== undefined) formData.append('link_url', link_url);
    if (is_active !== undefined) formData.append('is_active', is_active ? '1' : '0');
    if (sort_order !== undefined) formData.append('sort_order', String(sort_order));
    const response = await apiClient.put(`/client/admin/partners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deletePartner: async (id) => {
    const response = await apiClient.delete(`/client/admin/partners/${id}`);
    return response.data;
  },

  bulkDeletePartners: async (ids = []) => {
    const response = await apiClient.delete(`/client/admin/partners/bulk`, { data: { ids } });
    return response.data;
  },
};

// Gallery API methods
export const galleryAPI = {
  getGalleries: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'sort_order',
      sort_order: params.sort_order || 'asc',
    });
    if (params.is_active !== undefined && params.is_active !== null) {
      queryParams.append('is_active', params.is_active);
    }
    const response = await apiClient.get(`/client/admin/galleries?${queryParams}`);
    return response.data;
  },

  getGallery: async (id) => {
    const response = await apiClient.get(`/client/admin/galleries/${id}`);
    return response.data;
  },

  createGallery: async ({ title, imageFile, is_active = true, sort_order = 0 }) => {
    const formData = new FormData();
    formData.append('title', title || '');
    if (imageFile) formData.append('image', imageFile);
    formData.append('is_active', is_active ? '1' : '0');
    formData.append('sort_order', String(sort_order));
    const response = await apiClient.post(`/client/admin/galleries`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateGallery: async (id, { title, imageFile, is_active, sort_order }) => {
    const formData = new FormData();
    if (title !== undefined) formData.append('title', title);
    if (imageFile) formData.append('image', imageFile);
    if (is_active !== undefined) formData.append('is_active', is_active ? '1' : '0');
    if (sort_order !== undefined) formData.append('sort_order', String(sort_order));
    const response = await apiClient.put(`/client/admin/galleries/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteGallery: async (id) => {
    const response = await apiClient.delete(`/client/admin/galleries/${id}`);
    return response.data;
  },

  bulkDeleteGalleries: async (ids = []) => {
    const response = await apiClient.delete(`/client/admin/galleries/bulk`, { data: { ids } });
    return response.data;
  },
};

// Newsletter API methods
export const newsletterAPI = {
  getNewsletters: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'created_at',
      sort_order: params.sort_order || 'desc',
    });
    const response = await apiClient.get(`/client/admin/newsletters?${queryParams}`);
    return response.data;
  },

  getNewsletter: async (id) => {
    const response = await apiClient.get(`/client/admin/newsletters/${id}`);
    return response.data;
  },

  deleteNewsletter: async (id) => {
    const response = await apiClient.delete(`/client/admin/newsletters/${id}`);
    return response.data;
  },

  bulkDeleteNewsletters: async (ids = []) => {
    const response = await apiClient.delete(`/client/admin/newsletters/bulk`, { data: { ids } });
    return response.data;
  },
};

// News API methods (AINET In News)
export const newsAPI = {
  getNews: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'sort_order',
      sort_order: params.sort_order || 'asc',
    });
    if (params.is_active !== undefined && params.is_active !== null) {
      queryParams.append('is_active', params.is_active);
    }
    const response = await apiClient.get(`/client/admin/news?${queryParams}`);
    return response.data;
  },

  getNewsItem: async (id) => {
    const response = await apiClient.get(`/client/admin/news/${id}`);
    return response.data;
  },

  createNews: async ({ location, publisher_name, publisherLogoFile, conference_name, title, summary, has_video = false, view_count = 0, link_url, published_date, is_active = true, sort_order = 0 }) => {
    const formData = new FormData();
    if (location) formData.append('location', location);
    formData.append('publisher_name', publisher_name || '');
    if (publisherLogoFile) formData.append('publisher_logo', publisherLogoFile);
    if (conference_name) formData.append('conference_name', conference_name);
    formData.append('title', title || '');
    formData.append('summary', summary || '');
    formData.append('has_video', has_video ? '1' : '0');
    formData.append('view_count', String(view_count));
    if (link_url) formData.append('link_url', link_url);
    if (published_date) formData.append('published_date', published_date);
    formData.append('is_active', is_active ? '1' : '0');
    formData.append('sort_order', String(sort_order));
    const response = await apiClient.post(`/client/admin/news`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateNews: async (id, { location, publisher_name, publisherLogoFile, conference_name, title, summary, has_video, view_count, link_url, published_date, is_active, sort_order }) => {
    const formData = new FormData();
    if (location !== undefined) formData.append('location', location || '');
    if (publisher_name !== undefined) formData.append('publisher_name', publisher_name);
    if (publisherLogoFile) formData.append('publisher_logo', publisherLogoFile);
    if (conference_name !== undefined) formData.append('conference_name', conference_name || '');
    if (title !== undefined) formData.append('title', title);
    if (summary !== undefined) formData.append('summary', summary);
    if (has_video !== undefined) formData.append('has_video', has_video ? '1' : '0');
    if (view_count !== undefined) formData.append('view_count', String(view_count));
    if (link_url !== undefined) formData.append('link_url', link_url || '');
    if (published_date !== undefined) formData.append('published_date', published_date || '');
    if (is_active !== undefined) formData.append('is_active', is_active ? '1' : '0');
    if (sort_order !== undefined) formData.append('sort_order', String(sort_order));
    const response = await apiClient.put(`/client/admin/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteNews: async (id) => {
    const response = await apiClient.delete(`/client/admin/news/${id}`);
    return response.data;
  },

  bulkDeleteNews: async (ids = []) => {
    const response = await apiClient.delete(`/client/admin/news/bulk`, { data: { ids } });
    return response.data;
  },
};

// User API methods
export const userAPI = {
  // Get all users
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams({
      per_page: params.per_page || 10,
      page: params.page || 1,
      search: params.search || '',
      sort_by: params.sort_by || 'created_at',
      sort_order: params.sort_order || 'desc',
    });
    const response = await apiClient.get(`/client/admin/users?${queryParams}`);
    return response.data;
  },

  // Get single user
  getUser: async (id) => {
    const response = await apiClient.get(`/client/admin/users/${id}`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await apiClient.get(`/client/admin/users/stats`);
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await apiClient.post(`/client/admin/users`, userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/client/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/client/admin/users/${id}`);
    return response.data;
  },

  // Bulk delete users
  bulkDeleteUsers: async (ids = []) => {
    const response = await apiClient.delete(`/client/admin/users/bulk`, { data: { ids } });
    return response.data;
  },
};

// Public website API methods
export const websiteAPI = {
  getBanners: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }
    const response = await axios.get(`${baseUrl}/client/banners${queryParams.toString() ? '?' + queryParams : ''}`);
    return response.data;
  },

  getConference: async () => {
    const response = await axios.get(`${baseUrl}/client/conference`);
    return response.data;
  },

  getPartners: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }
    const response = await axios.get(`${baseUrl}/client/partners${queryParams.toString() ? '?' + queryParams : ''}`);
    return response.data;
  },

  getEvents: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }
    if (params.event_type) {
      queryParams.append('event_type', params.event_type);
    }
    if (params.exclude_conference !== undefined) {
      queryParams.append('exclude_conference', params.exclude_conference);
    }
    const response = await axios.get(`${baseUrl}/client/events${queryParams.toString() ? '?' + queryParams : ''}`);
    return response.data;
  },

  getGalleries: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }
    const response = await axios.get(`${baseUrl}/client/galleries${queryParams.toString() ? '?' + queryParams : ''}`);
    return response.data;
  },

  subscribeNewsletter: async ({ name, email, whatsapp_no }) => {
    const response = await axios.post(`${baseUrl}/client/newsletter/subscribe`, {
      name,
      email,
      whatsapp_no,
    });
    return response.data;
  },

  getNews: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit);
    }
    const response = await axios.get(`${baseUrl}/client/news${queryParams.toString() ? '?' + queryParams : ''}`);
    return response.data;
  },

  getHighlights: async () => {
    const response = await axios.get(`${baseUrl}/client/highlights`);
    return response.data;
  },
};

// Highlight API methods
export const highlightAPI = {
  getHighlights: async () => {
    const response = await apiClient.get(`/client/admin/highlights`);
    return response.data;
  },

  getHighlight: async (id) => {
    const response = await apiClient.get(`/client/admin/highlights/${id}`);
    return response.data;
  },

  createHighlight: async ({ heading, subheading, is_active = true, sort_order = 0 }) => {
    const response = await apiClient.post(`/client/admin/highlights`, {
      heading,
      subheading,
      is_active,
      sort_order,
    });
    return response.data;
  },

  updateHighlight: async (id, { heading, subheading, is_active, sort_order }) => {
    const response = await apiClient.put(`/client/admin/highlights/${id}`, {
      heading,
      subheading,
      is_active,
      sort_order,
    });
    return response.data;
  },

  deleteHighlight: async (id) => {
    const response = await apiClient.delete(`/client/admin/highlights/${id}`);
    return response.data;
  },
};

export default apiClient;

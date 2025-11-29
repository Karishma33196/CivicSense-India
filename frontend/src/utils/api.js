import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Add token to all requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (userData) => API.post('/auth/register', userData),
  getMe: () => API.get('/auth/me')
};

export const usersAPI = {
  getAll: () => API.get('/users'),
  delete: (id) => API.delete(`/users/${id}`),
  updateStatus: (id, isActive) => API.patch(`/users/${id}/status`, { isActive })
};

export const contentAPI = {
  getAll: () => API.get('/content'),
  create: (contentData) => API.post('/content', contentData),
  approve: (id) => API.patch(`/content/${id}/approve`),
  delete: (id) => API.delete(`/content/${id}`) // This should be the only declaration
};



// ... existing code ...

export const discussionsAPI = {
  getAll: (page = 1, limit = 10) => API.get(`/discussions?page=${page}&limit=${limit}`),
  getById: (id) => API.get(`/discussions/${id}`),
  create: (discussionData) => API.post('/discussions', discussionData),
  addReply: (id, message) => API.post(`/discussions/${id}/replies`, { message }),
  getByContent: (contentId) => API.get(`/discussions/content/${contentId}`),
  delete: (id) => API.delete(`/discussions/${id}`)
};

// ... rest of the code ...
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5127/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const employeeApi = {
  getAll:  (search = '') => api.get('/employees', { params: search ? { search } : {} }),
  getById: (id)          => api.get(`/employees/${id}`),
  create:  (data)        => api.post('/employees', data),
  update:  (id, data)    => api.put(`/employees/${id}`, data),
  delete:  (id)          => api.delete(`/employees/${id}`),
};

export const authApi = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
};
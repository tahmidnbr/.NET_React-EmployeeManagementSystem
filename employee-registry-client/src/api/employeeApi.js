import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5127/api',
  headers: { 'Content-Type': 'application/json' },
});

export const employeeApi = {
  getAll: (search = '') =>
    api.get('/employees', { params: search ? { search } : {} }),

  getById: (id) =>
    api.get(`/employees/${id}`),

  create: (data) =>
    api.post('/employees', data),

  update: (id, data) =>
    api.put(`/employees/${id}`, data),

  delete: (id) =>
    api.delete(`/employees/${id}`),
};
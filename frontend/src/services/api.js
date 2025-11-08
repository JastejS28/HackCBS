import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle responses
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

// User API
export const userAPI = {
    getCurrentUser: () => api.get('/user/me'),
    updateProfile: (data) => api.put('/user/profile', data),
    deleteAccount: () => api.delete('/user/account')
};

// Data Source API
export const dataSourceAPI = {
    submitDatabase: (data) => api.post('/datasource/database', data),
    submitFile: (formData) => api.post('/datasource/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAll: () => api.get('/datasource')
};

// Analysis API
export const analysisAPI = {
    getById: (id) => api.get(`/analysis/${id}`),
    getAll: () => api.get('/analysis'),
    checkStatus: (id) => api.get(`/analysis/${id}/status`),
    askQuestion: (id, question) => api.post(`/analysis/${id}/ask`, { question }),
    exportReport: (id) => api.get(`/analysis/${id}/export`, {
        responseType: 'blob'
    })
};

export default api;

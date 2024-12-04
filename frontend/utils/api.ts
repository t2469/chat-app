import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
    baseURL: API_URL,
});

// リクエストにトークンを追加
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

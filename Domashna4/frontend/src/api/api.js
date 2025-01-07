import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_SPRING_URL || 'https://makcii-dnb2cbdphscuf9d8.westeurope-01.azurewebsites.net/spring',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;


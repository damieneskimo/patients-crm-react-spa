import axios from 'axios';

export const apiClient = axios.create({
    // backend API url, please change if it's different
    baseURL: 'http://localhost:8000',
    withCredentials: true,
});


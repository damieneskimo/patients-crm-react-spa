import axios from 'axios';

export const apiClient = axios.create({
    // backend API url, please change if it's different
    baseURL: process.env.REACT_APP_API_BASE_URL?? window.location.origin,
    withCredentials: true,
});


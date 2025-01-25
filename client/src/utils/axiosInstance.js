import axios from 'axios';
import { BASE_URL } from './constants';

const axiosInstance = axios.create({
    baseURL: BASE_URL, // Base URL for your API
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        "Content-Type": "application/json", // Default Content-Type header
    },
    withCredentials: true, // Enable cookies for cross-origin requests
});

export default axiosInstance;

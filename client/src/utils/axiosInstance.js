import axios from 'axios';
import { BASE_URL } from './constants';

const axiosInstance=axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials: true, // Enable cookies for requests
})

export default axiosInstance;
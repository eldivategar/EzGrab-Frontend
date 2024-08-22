import axios from 'axios'

const config = {
    baseURL: import.meta.env.VITE_APP_API_URL,
};

const axiosInstance = axios.create(config);

export default axiosInstance;
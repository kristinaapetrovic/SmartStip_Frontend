import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', 
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      if (response.status === 401) {
        localStorage.removeItem('ACCESS_TOKEN');
        console.warn('Unauthorized! Token removed.');
      } else if (response.status === 500) {
        console.error('Server error.');
      }
    } else {
      console.error('Network or CORS error.');
    }

    return Promise.reject(error); 
  }
);

export default axiosClient;

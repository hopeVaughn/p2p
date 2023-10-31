import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,

});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token && !config.url?.includes('refresh')) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});



export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:3000/api/",
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


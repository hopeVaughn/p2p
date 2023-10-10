import axios from 'axios';

const createAPIInstance = (refreshTokenFunc: () => Promise<void>) => {
  const api = axios.create({
    baseURL: "http://localhost:3000/api/"
  });

  api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  api.interceptors.response.use((response) => {
    return response;
  }, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      await refreshTokenFunc(); // Here we use the provided refreshToken function
      const newAccessToken = sessionStorage.getItem('accessToken');

      api.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    }

    return Promise.reject(error);
  });

  return api;
};

export { createAPIInstance }


import api from './axiosDefault';

const authBaseURL = 'auth/';

export const signUpAPI = async (email: string, password: string) => {
  return await api.post(`${authBaseURL}signup`, { email, password });
};

export const signInAPI = async (email: string, password: string) => {
  return await api.post(`${authBaseURL}signin`, { email, password });
};

export const logoutAPI = async () => {
  return await api.post(`${authBaseURL}logout`);
};

export const refreshTokenAPI = async () => {
  return await api.post(`${authBaseURL}refresh`);
};

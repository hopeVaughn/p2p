import api from './axiosDefault';

const authBaseURL = 'auth/';

type AuthCredentials = {
  email: string;
  password: string;
};

type LogoutCredentials = {
  accessToken: string;
};

type AutResponse = {
  accessToken: string;
};

type LogoutResponse = {
  message: string;
};

// API calls
export const signUpAPI = async (data: AuthCredentials): Promise<AutResponse> => {
  const response = await api.post<AutResponse>(`${authBaseURL}signup`, data);
  return response.data;
};

export const signInAPI = async (data: AuthCredentials): Promise<AutResponse> => {
  const response = await api.post<AutResponse>(`${authBaseURL}signin`, data);
  return response.data;
};

export const logoutAPI = async (data: LogoutCredentials): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>(`${authBaseURL}logout`, data);
  return response.data;
};

export const refreshTokenAPI = async (): Promise<AutResponse> => {
  const response = await api.post<AutResponse>(`${authBaseURL}refresh`);
  return response.data;
};

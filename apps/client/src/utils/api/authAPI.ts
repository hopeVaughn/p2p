import api from './axiosDefault';

const authBaseURL = 'auth/';

export type AuthCredentials = {
  email: string;
  password: string;
};

export type LogoutCredentials = {
  accessToken: string;
};
export type TokenCredentials = {
  accessToken: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type LogoutResponse = {
  message: string;
};

// API calls
export const signUpAPI = async (data: AuthCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`${authBaseURL}signup`, data);
  return response.data;
};

export const signInAPI = async (data: AuthCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`${authBaseURL}signin`, data);
  return response.data;
};

export const logoutAPI = async (data: { refreshToken: string; }): Promise<LogoutResponse> => {
  const response = await api.post<LogoutResponse>(`${authBaseURL}logout`, data);
  return response.data;
};


export const refreshTokenAPI = async ({ activeRefreshToken }: { activeRefreshToken: string; }): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`${authBaseURL}refresh`, { activeRefreshToken });
  return response.data;
};


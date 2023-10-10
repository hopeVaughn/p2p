import { useMutation } from '@tanstack/react-query';
import api from './axiosDefault';
import { toast } from 'react-toastify';

const authBaseURL = 'auth/';

interface GenericAPIError {
  response?: {
    data?: {
      msg?: string;
      [key: string]: unknown; // This allows for other properties in the data object.
    };
  };
  [key: string]: unknown; // This allows for other properties in the error object.
}
// API calls
const signUpAPI = (data: { email: string; password: string; }) => api.post(`${authBaseURL}signup`, data);
const signInAPI = (data: { email: string; password: string; }) => api.post(`${authBaseURL}signin`, data);
const logoutAPI = () => api.post(`${authBaseURL}logout`);
const refreshTokenAPI = () => api.post(`${authBaseURL}refresh`);

// Custom React Query Hooks
export const useSignUp = () => {
  return useMutation(signUpAPI, {
    onSuccess: () => {
      toast.success('User registered');
      // Additional logic after successful sign-up, if required
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error during signup';
      toast.error(errorMessage);
    }
  });
};

export const useSignIn = () => {
  return useMutation(signInAPI, {
    onSuccess: () => {
      toast.success('User signed in');
      // Additional logic after successful sign-in, if required
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error during signup';
      toast.error(errorMessage);
    }
  });
};

export const useLogout = () => {
  return useMutation(logoutAPI, {
    onSuccess: () => {
      toast.success('Logged out successfully');
      // Invalidate or refetch any relevant queries after logout if required
      // For example:
      // queryClient.invalidateQueries('someQueryKey');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error during signup';
      toast.error(errorMessage);
    }
  });
};

export const useRefreshToken = () => {
  return useMutation(refreshTokenAPI, {
    onSuccess: () => {
      toast.success('Token refreshed');
      // Invalidate or refetch any relevant queries after refreshing the token if needed
      // For example:
      // queryClient.invalidateQueries('someQueryKey');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error during signup';
      toast.error(errorMessage);
    }
  });
};

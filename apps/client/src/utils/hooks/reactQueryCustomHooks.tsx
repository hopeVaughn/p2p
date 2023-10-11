import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { signUpAPI, signInAPI, logoutAPI, refreshTokenAPI } from '../api';
import { useNavigate } from 'react-router-dom';

type GenericAPIError = {
  response?: {
    data?: {
      msg?: string;
      [key: string]: unknown; // This allows for other properties in the data object.
    };
  };
  [key: string]: unknown; // This allows for other properties in the error object.
};

type AuthCredentials = {
  email: string;
  password: string;
};

type AutResponse = {
  accessToken: string;
};

// Custom React Query Hooks
export const useSignUp = () => {
  const navigate = useNavigate();
  const mutation = useMutation(signUpAPI, {
    onSuccess: (data: AutResponse) => {
      sessionStorage.setItem('accessToken', data.accessToken);
      toast.success('User registered');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error during signup';
      toast.error(errorMessage);
    },
    onSettled: (_, error) => {
      if (!error) {
        navigate('/dashboard');
      }
    }
  });

  return {
    signUp: mutation.mutate,
    isLoading: mutation.isLoading,
    signUpError: mutation.error
  };
};


export const useSignIn = () => {
  const navigate = useNavigate();
  const mutation = useMutation((data: AuthCredentials) => signInAPI(data), {
    onSuccess: (data) => {
      sessionStorage.setItem('accessToken', data.accessToken);
      toast.success('User signed in');
      navigate('/dashboard');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Invalid Credentials';
      toast.error(errorMessage);
    },
    onSettled: (_, error) => {
      if (!error) {
        navigate('/dashboard');
      }
    }
  });

  return {
    signIn: mutation.mutate,
    isLoading: mutation.isLoading,
    signInError: mutation.error
  };
};

export const useLogout = () => {
  const mutation = useMutation(logoutAPI, {
    onSuccess: () => {
      sessionStorage.removeItem('accessToken');
      toast.success('Logged out successfully');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error during logout';
      toast.error(errorMessage);
    }
  });

  // Custom function to handle the logout process
  const handleLogout = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      mutation.mutate({ accessToken });
    }
  };

  return {
    logout: handleLogout,
    isLoading: mutation.isLoading,
  };
};
export const useRefreshToken = () => {
  const mutation = useMutation(refreshTokenAPI, {
    onSuccess: (data) => {
      sessionStorage.setItem('accessToken', data.accessToken);
      toast.success('Token refreshed');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error refreshing token';
      toast.error(errorMessage);
    }
  });

  return {
    refreshToken: mutation.mutate,
    isLoading: mutation.isLoading
  };
};
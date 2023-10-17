import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { signUpAPI, signInAPI, logoutAPI, refreshTokenAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import { createBathroomAPI, deleteBathroomAPI, findAllBathroomsAPI } from '../api';

type GenericAPIError = {
  response?: {
    data?: {
      msg?: string;
      [key: string]: unknown; // This allows for other properties in the data object.
    };
  };
  [key: string]: unknown; // This allows for other properties in the error object.
};

// type AuthCredentials = {
//   email: string;
//   password: string;
// };

type AutResponse = {
  accessToken: string;
};

// Custom React Query Hooks
export const useSignUp = () => {
  const navigate = useNavigate();

  const {
    mutateAsync: signUp,
    status,
    error: signUpError
  } = useMutation({
    mutationFn: signUpAPI,
    onSuccess: (data: AutResponse) => {
      sessionStorage.setItem('accessToken', data.accessToken);
      toast.success('User registered');
      navigate('/dashboard');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error during signup';
      toast.error(errorMessage);
    }
  });

  return {
    signUp,
    signUpLoading: status === 'pending',
    signUpError
  };
};


export const useSignIn = () => {
  const navigate = useNavigate();

  const { mutateAsync: signIn, status, error: signInError } = useMutation({
    mutationFn: signInAPI,
    onSuccess: (data) => {
      sessionStorage.setItem('accessToken', data.accessToken);
      toast.success('Welcome Back!');
      navigate('/dashboard');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Invalid Credentials';
      toast.error(errorMessage);
    }
  });

  return {
    signIn,
    isLoading: status === 'pending',
    signInError
  };
};



export const useLogout = () => {
  const navigate = useNavigate();

  const { mutateAsync: logout, status } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      sessionStorage.removeItem('accessToken');
      toast.success('Logged out successfully');
      navigate('/');
      // Additional invalidations if needed
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error during logout';
      toast.error(errorMessage);
    }
  });

  return {
    logout: (accessToken: string) => {
      if (accessToken) {
        logout({ accessToken });
      }
    },
    isLoading: status === 'pending',
  };
};



export const useRefreshToken = () => {
  const {
    mutateAsync: refreshToken,
    status,
    error
  } = useMutation({
    mutationFn: refreshTokenAPI,
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
    refreshToken,
    isLoading: status === 'pending',
    error
  };
};


// Bathroom API custom hooks

// Create bathroom
export const useCreateBathroom = () => {
  const {
    mutateAsync: createBathroom,
    status,
    error: createError
  } = useMutation({
    mutationFn: createBathroomAPI,
    onSuccess: () => {
      toast.success('Bathroom created successfully');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error creating bathroom';
      toast.error(errorMessage);
    }
  });

  return {
    createBathroom,
    isLoadingCreateBathroom: status === 'pending',
    createError
  };
};

// Delete bathroom
export const useDeleteBathroom = () => {
  const {
    mutateAsync: deleteBathroom,
    status,
    error: deleteError
  } = useMutation({
    mutationFn: deleteBathroomAPI,
    onSuccess: () => {
      toast.success('Bathroom deleted successfully');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error deleting bathroom';
      toast.error(errorMessage);
    }
  });

  return {
    deleteBathroom,
    isLoading: status === 'pending',
    deleteError
  };
};


// Find all bathrooms near the user
export const useFindAllBathrooms = (lat: number, lng: number, radius: number, shouldFetch: boolean) => {
  const {
    data: bathrooms,
    status,
    error: errorFindAllBathrooms,
    refetch: refetchBathrooms,
    isFetching: isLoadingFindAllBathrooms
  } = useQuery({
    queryKey: ['bathrooms', lat, lng, radius],
    queryFn: () => findAllBathroomsAPI(lat, lng, radius),
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  // Side effects based on query status and error
  if (status === 'success') {
    toast.success('Bathrooms fetched successfully');
  }
  if (status === 'error') {
    // Ensure error is an instance of Error for safety
    const errorMessage = errorFindAllBathrooms instanceof Error ? errorFindAllBathrooms.message : 'Error fetching bathrooms';
    toast.error(errorMessage);
  }

  return {
    bathrooms,
    isLoadingFindAllBathrooms,
    errorFindAllBathrooms,
    refetchBathrooms
  };
};


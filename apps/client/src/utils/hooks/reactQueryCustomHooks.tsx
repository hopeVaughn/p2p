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

  const { mutateAsync: signUp, isLoading: signUpLoading, error: signUpError } = useMutation(signUpAPI, {
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
    signUpLoading,
    signUpError
  };
};



export const useSignIn = () => {
  const navigate = useNavigate();

  const { mutateAsync: signIn, isLoading, error: signInError } = useMutation(signInAPI, {
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
    isLoading,
    signInError
  };
};


export const useLogout = () => {
  // const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: logout, isLoading } = useMutation(logoutAPI, {
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
    isLoading,
  };
};


export const useRefreshToken = () => {
  const { mutateAsync: refreshToken, isLoading } = useMutation(refreshTokenAPI, {
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
    isLoading
  };
};


// Bathroom API custom hooks

// Create bathroom
export const useCreateBathroom = () => {

  const { mutateAsync: createBathroom, isLoading: isLoadingCreateBathroom, error: createError } = useMutation(createBathroomAPI, {
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
    isLoadingCreateBathroom,
    createError
  };
};

// Delete bathroom
export const useDeleteBathroom = () => {

  const { mutateAsync: deleteBathroom, isLoading, error: deleteError } = useMutation(deleteBathroomAPI, {
    onSuccess: () => {
      toast.success('Bathroom deleted successfully');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error deleting bathroom';
      toast.error(errorMessage);
    }
  });

  return {
    deleteBathroom,  // now this is an asynchronous function
    isLoading,
    deleteError
  };
};


// Find all bathrooms near the user
export const useFindAllBathrooms = (lat: number, lng: number, radius: number, shouldFetch: boolean) => {
  const {
    data: bathrooms,
    isLoading: isLoadingFindAllBathrooms,
    error: errorFindAllBathrooms,
    refetch: refetchBathrooms
  } = useQuery(['bathrooms', lat, lng, radius], () => findAllBathroomsAPI(lat, lng, radius), {
    onSuccess: () => {
      toast.success('Bathrooms fetched successfully');
    },
    onError: (error: GenericAPIError) => {
      const errorMessage = error?.response?.data?.msg || 'Error fetching bathrooms';
      toast.error(errorMessage);
    },
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  return {
    bathrooms,
    isLoadingFindAllBathrooms,
    errorFindAllBathrooms,
    refetchBathrooms
  };
};

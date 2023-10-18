import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { signUpAPI, signInAPI, logoutAPI, refreshTokenAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import { createBathroomAPI, deleteBathroomAPI, findAllBathroomsAPI, findBathroomByIdAPI } from '../api';


type AutResponse = {
  accessToken: string;
};

// Auth API custom hooks

// Custom React Query Hooks

// Sign Up
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
      toast.success("You've been signed up successfully!");
      navigate('/dashboard');
    },
    onError: () => {
      const errorMessage = signUpError instanceof Error ? signUpError.message : 'Error fetching bathrooms';
      toast.error(errorMessage);
    }
  });

  return {
    signUp,
    signUpLoading: status === 'pending',
    signUpError
  };
};

// Sign In
export const useSignIn = () => {
  const navigate = useNavigate();

  const {
    mutateAsync: signIn,
    status,
    error: signInError
  } = useMutation({
    mutationFn: signInAPI,
    onSuccess: (data) => {
      sessionStorage.setItem('accessToken', data.accessToken);
      toast.success('Welcome Back!');
      navigate('/dashboard');
    },
    onError: () => {
      const errorMessage = signInError instanceof Error ? signInError.message : 'Error fetching bathrooms';
      toast.error(errorMessage);
    }
  });

  return {
    signIn,
    isLoading: status === 'pending',
    signInError
  };
};


// Logout
export const useLogout = () => {
  const navigate = useNavigate();

  const { mutateAsync: logout, status, error: logOutError } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      sessionStorage.removeItem('accessToken');
      toast.success('Logged out successfully');
      navigate('/');
      // Additional invalidations if needed
    },
    onError: () => {
      const errorMessage = logOutError instanceof Error ? logOutError.message : 'Error fetching bathrooms';
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

// Refresh Token
export const useRefreshToken = () => {
  const {
    mutateAsync: refreshToken,
    status,
    error: refreshTokenError
  } = useMutation({
    mutationFn: refreshTokenAPI,
    onSuccess: (data) => {
      sessionStorage.setItem('accessToken', data.accessToken);
      // toast.success('Token refreshed');
    },
    onError: () => {
      const errorMessage = refreshTokenError instanceof Error ? refreshTokenError.message : 'Error fetching bathrooms';
      toast.error(errorMessage);
    }
  });

  return {
    refreshToken,
    isLoading: status === 'pending',
    refreshTokenError
  };
};


// Bathroom API custom hooks

// Create bathroom
export const useCreateBathroom = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createBathroom,
    status,
    error: createError
  } = useMutation({
    mutationFn: createBathroomAPI,
    onSuccess: () => {
      toast.success('Bathroom created successfully');

      // Invalidate and immediately refetch the "bathrooms" query
      queryClient.invalidateQueries({ queryKey: ['bathrooms'] });
      queryClient.refetchQueries({ queryKey: ['bathrooms'] });

    },
    onError: () => {
      const errorMessage = createError instanceof Error ? createError.message : 'Error fetching bathrooms';
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
      // Invalidate the cache
    },
    onError: () => {
      const errorMessage = deleteError instanceof Error ? deleteError.message : 'Error fetching bathrooms';
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

  if (status === 'error') {
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

// Find a specific bathroom by its ID
export const useFindBathroomById = (id: string, shouldFetch: boolean = true) => {
  const {
    data: bathroom,
    status,
    error: errorFindBathroomById,
    refetch: refetchBathroom,
    isLoading: isLoadingFindBathroomById
  } = useQuery({
    queryKey: ['bathroom', id],
    queryFn: () => findBathroomByIdAPI(id),
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  if (status === 'error') {
    const errorMessage = errorFindBathroomById instanceof Error ? errorFindBathroomById.message : 'Error fetching bathroom details';
    toast.error(errorMessage);
  }

  return {
    bathroom,
    refetchBathroom,
    errorFindBathroomById,
    isLoadingFindBathroomById
  };
};



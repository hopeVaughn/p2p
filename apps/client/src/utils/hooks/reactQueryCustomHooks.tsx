import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { signUpAPI, signInAPI, logoutAPI, refreshTokenAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import { createBathroomAPI, deleteBathroomAPI, findAllBathroomsAPI, findBathroomByIdAPI, createOrUpdateRatingAPI, reportAPI, verifyBathroomAPI } from '../api';


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
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteBathroom,
    status,
    error: deleteError
  } = useMutation({
    mutationFn: deleteBathroomAPI,
    onSuccess: () => {
      toast.success('Bathroom deleted successfully');

      // Invalidate and immediately refetch the "bathrooms" query
      queryClient.invalidateQueries({ queryKey: ['bathrooms'] });
      queryClient.refetchQueries({ queryKey: ['bathrooms'] });

    },
    onError: () => {
      const errorMessage = deleteError instanceof Error ? deleteError.message : 'Error deleting bathroom';
      toast.error(errorMessage);
    }
  });
  return {
    deleteBathroom,
    isSuccessDelete: status === 'success',
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


// Rating API custom hooks

// CreateOrUpdate rating

export const useCreateRating = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createRating,
    status,
    error: ratingError
  } = useMutation({
    mutationFn: createOrUpdateRatingAPI,
    onSuccess: () => {
      toast.success('Rating created successfully');

      // Invalidate and immediately refetch the "bathrooms" query
      queryClient.invalidateQueries({ queryKey: ['bathrooms'] });
      queryClient.refetchQueries({ queryKey: ['bathrooms'] });

    },
    onError: () => {
      const errorMessage = ratingError instanceof Error ? ratingError.message : 'Error fetching bathrooms';
      toast.error(errorMessage);
    }
  });

  return {
    createRating,
    isLoadingCreateRating: status === 'pending',
    ratingError,
  };
};


// Report API custom hooks

// Create report

export const useCreateReport = () => {

  const {
    mutateAsync: createReport,
    status,
    error: reportError
  } = useMutation({
    mutationFn: reportAPI,
    onSuccess: () => {
      toast.success('Report created successfully');
    },
    onError: () => {
      const errorMessage = reportError instanceof Error ? reportError.message : 'Error sending report';
      toast.error(errorMessage);
    }
  });

  return {
    createReport,
    isLoadingCreateReport: status === 'pending',
    reportError,
  };
};


// Verify API custom hooks

// Verify a bathroom

export const useCreateVerify = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createVerify,
    status,
    error: verifyError
  } = useMutation({
    mutationFn: verifyBathroomAPI,
    onSuccess: () => {
      toast.success('Bathroom verified successfully');
      // Invalidate and immediately refetch the "bathrooms" query
      queryClient.invalidateQueries({ queryKey: ['bathrooms'] });
      queryClient.refetchQueries({ queryKey: ['bathrooms'] });
    },
    onError: () => {
      const errorMessage = verifyError instanceof Error ? verifyError.message : 'Error verifying bathroom';
      toast.error(errorMessage);
    }
  });

  return {
    createVerify,
    isLoadingCreateVerify: status === 'pending',
    verifyError,
  };
};
// import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useMapContext } from '../context/MapContextProvider';
import { signUpAPI, signInAPI, logoutAPI, refreshTokenAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import { createBathroomAPI, deleteBathroomAPI, findAllBathroomsAPI, findBathroomByIdAPI, findUserCreatedBathroomsAPI, createOrUpdateRatingAPI, reportAPI, verifyBathroomAPI, updateBathroomAPI } from '../api';
import { RESET_STATE } from '../actions';

type AutResponse = {
  accessToken: string;
  refreshToken: string;
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
      sessionStorage.setItem('refreshToken', data.refreshToken);
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
      sessionStorage.setItem('refreshToken', data.refreshToken);
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
  const queryClient = useQueryClient();
  const { dispatch } = useMapContext();

  const { mutateAsync: logout, status, error: logOutError } = useMutation({
    mutationFn: (data: { refreshToken: string; }) => logoutAPI(data),
    onSuccess: () => {
      // Clear session storage and application state after successful logout
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      queryClient.clear();
      dispatch({ type: RESET_STATE });
      toast.success('Logged out successfully');
      navigate('/');
    },
    onError: (error) => {
      // Handle error case
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      toast.error(errorMessage);
    }
  });

  const performLogout = async () => {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (refreshToken) {
      // Call the logout mutation with the refreshToken
      await logout({ refreshToken });
    }
  };

  return {
    logout: performLogout,
    isLoading: status === 'pending',
    logOutError
  };
};


// Refresh Token
export const useRefreshToken = () => {
  const { mutateAsync: refreshToken, status, error: refreshTokenError } = useMutation({
    mutationFn: (tokenData: { activeRefreshToken: string; }) => refreshTokenAPI(tokenData),
    onSuccess: (data) => {
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken); // Update with new refresh token
    },
    onError: (error) => {
      // Handle error
      const errorMessage = error instanceof Error ? error.message : 'Error refreshing token';
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

// Update bathroom
export const useUpdateBathroom = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateBathroom,
    status,
    error: updateError
  } = useMutation({
    mutationFn: updateBathroomAPI,
    onSuccess: () => {
      toast.success('Bathroom updated successfully');

      // Invalidate and immediately refetch the "bathrooms" query
      queryClient.invalidateQueries({ queryKey: ['bathrooms'] });
      queryClient.refetchQueries({ queryKey: ['bathrooms'] });

    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Error updating bathroom';
      toast.error(errorMessage);
    }
  });
  return {
    updateBathroom,
    isSuccessUpdate: status === 'success',
    updateError
  };
};

export const useFindUserCreatedBathrooms = () => {
  const {
    data: userBathrooms,
    status: userBathroomsStatus,
    error: errorFindUserBathrooms,
    isFetching: isLoadingFindUserBathrooms,
    refetch: refetchUserBathrooms
  } = useQuery({
    queryKey: ['bathrooms', 'user_created'],
    queryFn: findUserCreatedBathroomsAPI,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    userBathrooms,
    isLoading: isLoadingFindUserBathrooms,
    error: errorFindUserBathrooms,
    userBathroomsStatus,
    refetchUserBathrooms
  };
};

export const useFindNearbyBathrooms = (lat: number, lng: number, radius: number, shouldFetch: boolean) => {
  const isValidLocation = lat !== 0 && lng !== 0;

  const {
    data: nearbyBathrooms,
    status: nearbyBathroomsStatus,
    error: errorFindNearbyBathrooms,
    isFetching: isLoadingFindNearbyBathrooms
  } = useQuery({
    queryKey: ['bathrooms', 'nearby', lat, lng, radius],
    queryFn: () => findAllBathroomsAPI(lat, lng, radius),
    enabled: shouldFetch && isValidLocation,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    nearbyBathrooms,
    isLoading: isLoadingFindNearbyBathrooms,
    nearbyBathroomsStatus,
    error: errorFindNearbyBathrooms
  };
};


// Find a specific bathroom by its ID
export const useFindBathroomById = (id: string, shouldFetch: boolean = true) => {
  const {
    data: bathroom,
    status,
    error: errorFindBathroomById,
    refetch: refetchBathroom,
    isLoading: isLoadingBathroomById
  } = useQuery({
    queryKey: ['bathroom', id],
    queryFn: () => findBathroomByIdAPI(id),
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });

  if (status === 'error') {
    const errorMessage = errorFindBathroomById instanceof Error ? errorFindBathroomById.message : 'Error updating bathroom details';
    toast.error(errorMessage);
  }

  return {
    bathroom,
    refetchBathroom,
    errorFindBathroomById,
    isLoadingBathroomById
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
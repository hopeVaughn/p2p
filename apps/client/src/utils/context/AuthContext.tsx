import React, { createContext, useReducer } from 'react';
import { AuthContextType, AuthProviderProps } from '../types';
import { useSignIn, useSignUp, useLogout, useRefreshToken } from '../api';
import { SIGN_IN, SIGN_UP, REFRESH, LOGOUT } from '../actions';
import { AuthState } from '../types';
import authReducer from '../reducer/authReducer';
import { accessTokenExpired } from '../helpers';

const initialState: AuthState = {
  user: null,
  token: sessionStorage.getItem('accessToken') || '',
  isAuthenticated: !accessTokenExpired(),
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const signUpMutation = useSignUp();
  const signInMutation = useSignIn();
  const logoutMutation = useLogout();
  const refreshTokenMutation = useRefreshToken();

  const handleSignUp = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await signUpMutation.mutateAsync({ email, password });
      if (response.data && response.data.accessToken) {
        dispatch({
          type: SIGN_UP,
          payload: {
            user: response.data.user,
            token: response.data.accessToken,
            isAuthenticated: true
          }
        });
        sessionStorage.setItem('accessToken', response.data.accessToken);
        return true;
      }
    } catch (error) {
      // Errors are being handled in the mutation itself
    }
    return false; // Make sure to return false if not successful.
  };

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await signInMutation.mutateAsync({ email, password });
      if (response.data && response.data.accessToken) {
        dispatch({
          type: SIGN_IN,
          payload: {
            user: response.data.user,
            token: response.data.accessToken,
            isAuthenticated: true
          }
        });
        sessionStorage.setItem('accessToken', response.data.accessToken);
        return true;
      }
    } catch (error) {
      // Errors are being handled in the mutation itself
    }
    return false; // Make sure to return false if not successful.
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      dispatch({ type: LOGOUT, payload: { isAuthenticated: false } });
      sessionStorage.removeItem('accessToken');
    } catch (error) {
      // Errors are being handled in the mutation itself
    }
  };

  const handleRefreshToken = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await refreshTokenMutation.mutateAsync();
      if (response.data && response.data.accessToken) {
        sessionStorage.setItem('accessToken', response.data.accessToken);
        dispatch({
          type: REFRESH,
          payload: { token: response.data.accessToken }
        });
      }
    } catch (error) {
      // This is crucial to let React Query's retry mechanism know that the retry has failed.
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      dispatch,
      signUp: handleSignUp,
      signIn: handleSignIn,
      logout: handleLogout,
      refreshToken: handleRefreshToken,
      signUpMutation,
      signInMutation,
      logoutMutation,
      refreshTokenMutation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

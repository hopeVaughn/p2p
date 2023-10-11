import React, { createContext, useReducer } from 'react';
import { AuthContextType, AuthProviderProps, AuthResponseData, AuthState } from '../types';
import { SIGN_IN, SIGN_UP, REFRESH, LOGOUT } from '../actions';
import authReducer from '../reducer/authReducer';
import { accessTokenExpired } from '../helpers';
import { toast } from 'react-toastify';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: sessionStorage.getItem('accessToken') || '',
  isAuthenticated: !accessTokenExpired(),
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const signUp = (data: AuthResponseData) => {
    if (!data.user || !data.accessToken) {
      toast.error('Data is missing'); // or handle the error in some other way
      return;
    }

    dispatch({
      type: SIGN_UP,
      payload: {
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true
      }
    });
    sessionStorage.setItem('accessToken', data.accessToken);
    toast.success('User registered');
  };

  const signIn = (data: AuthResponseData) => {
    if (!data.user || !data.accessToken) {
      toast.error('Data is missing'); // or handle the error in some other way
      return;
    }

    dispatch({
      type: SIGN_IN,
      payload: {
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true
      }
    });
    sessionStorage.setItem('accessToken', data.accessToken);
    toast.success('User logged in');
  };

  const logout = () => {
    dispatch({
      type: LOGOUT,
      payload: { isAuthenticated: false }
    });
    sessionStorage.removeItem('accessToken');
    toast.success('User logged out');
  };

  const refreshToken = (data: { accessToken?: string; }) => {
    if (!data.accessToken) {
      toast.error('Access token is missing');
      return;
    }
    sessionStorage.setItem('accessToken', data.accessToken);
    dispatch({
      type: REFRESH,
      payload: { token: data.accessToken }
    });
  };




  return (
    <AuthContext.Provider value={{
      ...state,
      signUp,
      signIn,
      logout,
      refreshToken,

    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

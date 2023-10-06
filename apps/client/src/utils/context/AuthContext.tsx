import React, { createContext, useReducer } from 'react';
import { AuthContextType, AuthProviderProps } from '../types';
import { signUpAPI, signInAPI, logoutAPI, refreshTokenAPI } from '../api';
import { SIGN_IN, SIGN_UP, REFRESH, LOGOUT } from '../actions';
import { AuthState } from '../types';
import authReducer from '../reducer/authReducer';
import { accessTokenExpired, decodeAccessToken } from '../helpers';


const initialState: AuthState = {
  user: null,
  token: sessionStorage.getItem('accessToken') || '',
  isAuthenticated: !accessTokenExpired(),
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Sign Up
  const signUp = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await signUpAPI(email, password);
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
        console.log("isAuthenticated:", state.isAuthenticated);

        return true;
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
    return false;
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await signInAPI(email, password);
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
        console.log("isAuthenticated:", state.isAuthenticated);

        console.log("user:", decodeAccessToken());

        return true;
      }
    } catch (error) {
      console.error("Error during signin:", error);
    }
    return false;
  };

  // Logout
  const logout = async () => {
    try {
      await logoutAPI();
      dispatch({ type: LOGOUT, payload: { isAuthenticated: false } });
      sessionStorage.removeItem('accessToken');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const response = await refreshTokenAPI();
      if (response.data && response.data.accessToken) {
        dispatch({
          type: REFRESH,
          payload: { token: response.data.accessToken }
        });
        sessionStorage.setItem('accessToken', response.data.accessToken);
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
    }
  };


  return (
    <AuthContext.Provider value={{ ...state, dispatch, signUp, signIn, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
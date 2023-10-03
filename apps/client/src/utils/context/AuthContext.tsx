import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { UserType, AuthContextType, AuthProviderProps } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string>(localStorage.getItem('accessToken') || '');

  // Sign In
  const signUp = async (email: string, password: string): Promise<boolean> => {
    console.log("Calling signUp");
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        email,
        password
      });
      if (response.data && response.data.refreshToken) {
        setToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    return false;
  };

  // Sign in
  const signIn = async (email: string, password: string): Promise<boolean> => {
    console.log("Calling signIn");
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signin', {
        email,
        password
      });
      if (response.data && response.data.accessToken) {
        setToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    return false;
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout');
      setToken('');
      setUser(null);
      localStorage.removeItem('accessToken');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/refresh');
      if (response.data && response.data.accessToken) {
        setToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      // Handle token refresh error. For instance, redirect to login page or notify the user.
    }
  };

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider value={{ user, token, signUp, signIn, logout, refreshToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create the custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

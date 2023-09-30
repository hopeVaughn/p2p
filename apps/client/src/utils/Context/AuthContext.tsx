import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { UserType, AuthContextType } from '../types';


const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);  // Replace with your user type and initial value
  const [token, setToken] = useState<string>('');

  const signUp = async (email: string, password: string): Promise<boolean> => {
    console.log("Calling signUp");
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        email,
        password
      });
      if (response.data && response.data.refreshToken) {
        setToken(response.data.accessToken);
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    return false;
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    console.log("Calling signIn");
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signin', {
        email,
        password
      });
      if (response.data && response.data.accessToken) {
        setToken(response.data.accessToken);
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    return false;
  };
  const logout = () => {
    // Clear the token and user state
    setToken('');
    setUser(null);
    // If there's a backend API to invalidate the token, call it here.
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/refresh');

      if (response.data && response.data.refreshToken) {
        setToken(response.data.refreshToken);
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      // Handle token refresh error
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

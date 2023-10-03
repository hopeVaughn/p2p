import { useContext } from "react";
import { AuthContext } from "../context";

// Updated custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, token, isAuthenticated, dispatch, signIn, signUp, refreshToken } = context;

  return { user, token, isAuthenticated, dispatch, signIn, signUp, refreshToken };
};
import { useContext } from "react";
import { AuthContext } from "../context";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const {
    user,
    token,
    isAuthenticated,
    dispatch,
    signIn,
    signUp,
    refreshToken,
    logout,
    signUpMutation,
    signInMutation,
    logoutMutation,
    refreshTokenMutation
  } = context;

  return {
    user,
    token,
    isAuthenticated,
    dispatch,
    signIn,
    signUp,
    refreshToken,
    logout,
    signUpMutation,
    signInMutation,
    logoutMutation,
    refreshTokenMutation
  };
};

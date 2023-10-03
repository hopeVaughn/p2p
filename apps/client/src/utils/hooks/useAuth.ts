import { useContext } from "react";
import { AuthContext } from "../context";

// Updated custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { state, isAuthenticated, dispatch } = context;

  // Destructure user and token from the state
  const { user, token } = state;

  return { user, token, isAuthenticated, dispatch };
};

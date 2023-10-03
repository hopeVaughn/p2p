import { ReactNode, Dispatch } from "react";
import { SIGN_IN, SIGN_UP, REFRESH, LOGOUT } from "../actions";

export type ProtectedRouteProps = {
  children: ReactNode;
};

export type AuthProviderProps = {
  children: ReactNode;
};

export type UserType = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthState = {
  user: UserType | null;
  token: string;
  isAuthenticated: boolean;
};

export type AuthAction =
  | { type: typeof SIGN_IN; payload: { user: UserType; token: string; }; }
  | { type: typeof SIGN_UP; payload: { user: UserType; token: string; }; }
  | { type: typeof LOGOUT; }
  | { type: typeof REFRESH; payload: { token: string; }; };


export type AuthContextType = {
  user: UserType | null;
  token: string;
  isAuthenticated: boolean;
  dispatch: Dispatch<AuthAction>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => void;
};

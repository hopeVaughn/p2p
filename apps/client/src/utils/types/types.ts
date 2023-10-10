import { ReactNode, ReactElement, Dispatch } from "react";
import { SIGN_IN, SIGN_UP, REFRESH, LOGOUT } from "../actions";
import { UseMutationResult } from '@tanstack/react-query';
export type ProtectedRouteProps = {
  children: ReactElement | null;
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
  | { type: typeof SIGN_IN; payload: { user: UserType; token: string; isAuthenticated: boolean; }; }
  | { type: typeof SIGN_UP; payload: { user: UserType; token: string; isAuthenticated: boolean; }; }
  | { type: typeof LOGOUT; payload: { isAuthenticated: boolean; }; }
  | { type: typeof REFRESH; payload: { token: string; }; };


export type AuthContextType = {
  user: UserType | null;
  token: string;
  isAuthenticated: boolean;
  dispatch: Dispatch<AuthAction>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  signUpMutation: UseMutationResult<unknown, unknown, { email: string, password: string; }, unknown>;
  signInMutation: UseMutationResult<unknown, unknown, { email: string, password: string; }, unknown>;
  logoutMutation: UseMutationResult<unknown, unknown, void, unknown>;
  refreshTokenMutation: UseMutationResult<unknown, unknown, void, unknown>;
};

// Navbar Types
export type NavigationItem = {
  name: string;
  href: string;
};

export type NavbarProps = {
  navigation: NavigationItem[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrolled?: boolean;
  navbarHeight?: number;
  buttons: boolean;
};

// JWT Decode type

export type DecodedToken = {
  exp?: number;
  [key: string]: unknown;  // This allows for other properties in the token
};


export type DecodedAccessToken = {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
};
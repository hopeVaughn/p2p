import { ReactNode, ReactElement } from "react";
import { SIGN_IN, SIGN_UP, REFRESH, LOGOUT } from "../actions";
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
export type AuthResponseData = {
  user?: UserType;
  accessToken?: string;
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
  signIn: (data: AuthResponseData) => void;
  signUp: (data: AuthResponseData) => void;
  logout: () => void;
  refreshToken: (data: AuthResponseData) => void;
};

export type AxiosError = {
  response?: {
    data?: {
      msg?: string;
    };
  };
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
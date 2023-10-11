import { ReactElement } from "react";

export type ProtectedRouteProps = {
  children: ReactElement | null;
};

export type UserType = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
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
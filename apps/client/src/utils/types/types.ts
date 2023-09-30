import { ReactNode } from "react";

export type ProtectedRouteProps = {
  children: ReactNode;
};

export type UserType = {
  id: string;
  email: string;
  password: string;
  hashedRt?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthContextType = {
  user: UserType | null;
  token: string;
  signIn: (email: string, password: string) => void;
  signUp: (username: string, password: string) => void;
  logout: () => void;
  refreshToken: () => void;
};
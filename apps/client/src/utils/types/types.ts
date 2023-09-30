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

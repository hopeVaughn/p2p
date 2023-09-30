import { RoleName } from "@prisma/client";
export type JwtPayload = {
  sub: string;
  email: string;
  roles: RoleName[];
};
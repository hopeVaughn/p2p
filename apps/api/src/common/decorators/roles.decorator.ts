import { SetMetadata } from "@nestjs/common";
import { RoleName } from "@prisma/client";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);

// This will allow us to use the @Roles decorator in our controllers
// ex: @Roles(UserRole.ADMIN)
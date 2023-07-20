import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, RoleName } from '@prisma/client';
@Injectable()
export class UserRoleService {
  constructor(private prisma: PrismaService) {}

  /**
   * Assigns a role to a user.
   * @param userId - The ID of the user to assign the role to.
   * @param roleName - The name of the role to assign to the user.
   * @throws InternalServerErrorException if there was an error assigning the role.
   */
  async changeRole(userId: string, roleName: RoleName): Promise<void> {
    const userRoles = await this.getRolesForUser(userId);

    const existingRole = userRoles.includes(roleName);
    try {
      if (!existingRole) {
        // create a role table entry if it doesn't exist

        const newRole = await this.prisma.role.create({
          data: {
            name: roleName,
          },
        });

        // assign the new role to the user
        await this.prisma.userRole.updateMany({
          where: { roleId: newRole.id },
          data: { roleId: newRole.id },
        });
      } else {
        // assign the existing role to the user

        await this.prisma.userRole.updateMany({
          where: { roleId: existingRole.id },
          data: { roleId: existingRole.id },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error changing role: ${error.message}`,
      );
    }
  }

  /**
   * Gets all roles assigned to a user.
   * @param userId - The ID of the user to get the roles for.
   * @returns An array of Role objects assigned to the user.
   * @throws NotFoundException if no roles were found for the user.
   * @throws InternalServerErrorException if there was an error fetching the roles.
   */
  async getRolesForUser(userId: string): Promise<RoleName[]> {
    try {
      const userRoles = await this.prisma.userRole.findMany({
        where: { userId: userId },
        include: { role: true },
      });

      if (!userRoles) {
        throw new NotFoundException('Roles not found for this user');
      }

      return userRoles.map((userRole) => userRole.role.name);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error fetching roles: ${error.message}`,
      );
    }
  }

  /**
   * Checks if a user has a specific role.
   * @param userId - The ID of the user to check the role for.
   * @param roleName - The name of the role to check for.
   * @returns True if the user has the role, false otherwise.
   * @throws InternalServerErrorException if there was an error checking the user role.
   */
  async checkUserRole(userId: string, roleName: string): Promise<boolean> {
    try {
      const userRoles = await this.getRolesForUser(userId);
      return userRoles.some((role) => role.name === roleName);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error checking user role: ${error.message}`,
      );
    }
  }
}

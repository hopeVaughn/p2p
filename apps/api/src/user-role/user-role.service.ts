import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRoleService {
  constructor(private prisma: PrismaService) {}

  /**
   * Assigns a role to a user.
   * @param userId - The ID of the user to assign the role to.
   * @param roleId - The ID of the role to assign to the user.
   * @throws InternalServerErrorException if there was an error assigning the role.
   */
  async assignRole(userId: string, roleId: string): Promise<void> {
    try {
      await this.prisma.userRole.create({
        data: {
          userId,
          roleId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error assigning role: ${error.message}`,
      );
    }
  }

  /**
   * Removes a role from a user.
   * @param userId - The ID of the user to remove the role from.
   * @param roleId - The ID of the role to remove from the user.
   * @throws NotFoundException if the role was not found for the user.
   * @throws InternalServerErrorException if there was an error removing the role.
   */
  async removeRole(userId: string, roleId: string): Promise<void> {
    try {
      const deleteResult = await this.prisma.userRole.deleteMany({
        where: {
          userId,
          roleId,
        },
      });

      if (deleteResult.count === 0) {
        throw new NotFoundException('Role not found for this user');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error removing role: ${error.message}`,
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
  async getRolesForUser(userId: string): Promise<Role[]> {
    try {
      const userRoles = await this.prisma.userRole.findMany({
        where: { userId },
        include: { role: true },
      });

      if (!userRoles) {
        throw new NotFoundException('Roles not found for this user');
      }

      return userRoles.map((userRole) => userRole.role);
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

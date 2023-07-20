import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleName } from '@prisma/client';
@Injectable()
export class UserRoleService {
  constructor(private prisma: PrismaService) {}

  /**
   * Assigns a role to a user.
   * @param userId - The ID of the user to assign the role to.
   * @param roleName - The name of the role to assign to the user.
   * @throws InternalServerErrorException if there was an error assigning the role.
   */
  async changeRole(id: string, roleName: RoleName): Promise<void> {
    try {
      // Check if user already has this role
      const userRoleExists = await this.prisma.userRole.findFirst({
        where: {
          userId: id,
          role: roleName,
        },
      });

      // If the role exists for the user, then update it to reset the 'updatedAt' field
      if (userRoleExists) {
        await this.prisma.userRole.update({
          where: {
            id: userRoleExists.id,
          },
          data: {},
        });
      }
      // If the role doesn't exist for the user, then create a new one
      else {
        await this.prisma.userRole.create({
          data: {
            userId: id,
            role: roleName,
          },
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
  // async getRolesForUser(userId: string): Promise<RoleName[]> {
  //   try {
  //     const userRoles = await this.prisma.userRole.findMany({
  //       where: { userId },
  //       include: { role: true },
  //     });

  //     if (!userRoles) {
  //       throw new NotFoundException('Roles not found for this user');
  //     }

  //     return userRoles.map((userRole) => userRole.role.name);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException(
  //       `Error fetching roles: ${error.message}`,
  //     );
  //   }
  // }

  /**
   * Checks if a user has a specific role.
   * @param userId - The ID of the user to check the role for.
   * @param roleName - The name of the role to check for.
   * @returns True if the user has the role, false otherwise.
   * @throws InternalServerErrorException if there was an error checking the user role.
   */
  // async checkUserRole(userId: string, roleName: string): Promise<boolean> {
  //   try {
  //     const userRoles = await this.getRolesForUser(userId);
  //     return userRoles.includes(roleName as RoleName);
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       `Error checking user role: ${error.message}`,
  //     );
  //   }
  // }
}

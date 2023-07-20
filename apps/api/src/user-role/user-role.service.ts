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
}

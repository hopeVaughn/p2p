import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, RoleName } from '@prisma/client';
@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new role.
   * @param name - The name of the role to create.
   * @throws InternalServerErrorException if there was an error creating the role.
   */
  async createRole(name: RoleName): Promise<Role> {
    try {
      return await this.prisma.role.create({
        data: { name },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating role: ${error.message}`,
      );
    }
  }

  /**
   * Fetches a role by its ID.
   * @param id - The ID of the role to fetch.
   * @throws NotFoundException if no role was found with the given ID.
   * @throws InternalServerErrorException if there was an error fetching the role.
   */
  async getRoleById(id: string): Promise<Role> {
    try {
      const role = await this.prisma.role.findUnique({ where: { id } });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error fetching role: ${error.message}`,
      );
    }
  }

  /**
   * Deletes a role by its ID.
   * @param id - The ID of the role to delete.
   * @throws NotFoundException if no role was found with the given ID.
   * @throws InternalServerErrorException if there was an error deleting the role.
   */
  async deleteRole(id: string): Promise<void> {
    try {
      const deleteResult = await this.prisma.role.delete({ where: { id } });

      if (!deleteResult) {
        throw new NotFoundException('Role not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error deleting role: ${error.message}`,
      );
    }
  }
}

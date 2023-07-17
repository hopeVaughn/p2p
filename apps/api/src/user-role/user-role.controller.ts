import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRoleService } from './user-role.service';

@Controller('users/:userId/roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  /**
   * Assigns a role to a user.
   * @route POST /users/:userId/roles/:roleId
   */
  @Post(':roleId')
  async assignRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    try {
      await this.userRoleService.assignRole(userId, roleId);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * Removes a role from a user.
   * @route DELETE /users/:userId/roles/:roleId
   */
  @Delete(':roleId')
  async removeRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    try {
      await this.userRoleService.removeRole(userId, roleId);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * Gets all roles assigned to a user.
   * @route GET /users/:userId/roles
   */
  @Get()
  async getRolesForUser(@Param('userId') userId: string) {
    try {
      return await this.userRoleService.getRolesForUser(userId);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * Checks if a user has a specific role.
   * @route GET /users/:userId/roles/:roleName
   */
  @Get(':roleName')
  async checkUserRole(
    @Param('userId') userId: string,
    @Param('roleName') roleName: string,
  ) {
    try {
      return await this.userRoleService.checkUserRole(userId, roleName);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}

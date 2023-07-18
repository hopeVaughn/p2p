import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  InternalServerErrorException,
  NotFoundException,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserRoleService } from './user-role.service';
import { Roles } from './decorator';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { RoleName } from '@prisma/client';
import { RolesGuard } from './guard';
@Controller('user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  /**
   * Assigns a role to a user.
   * @route POST /users/:userId/roles/:roleId
   */

  @Patch('update/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async changeRole(
    @Param('userId') userId: string,
    @Body() roleName: RoleName,
  ) {
    try {
      await this.userRoleService.changeRole(userId, roleName);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * Gets all roles assigned to a user.
   * @route GET /users/:userId/roles
   */
  @Get(':userid')
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
   * @route GET /users/user-roles/:userId/:roleName
   */
  @Get('user:id/:roleName')
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

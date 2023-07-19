import {
  Controller,
  Body,
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
// import { GetUser } from '../auth/decorator';
// import { User } from '@prisma/client';
import { RoleName } from '@prisma/client';
import { RolesGuard } from './guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER', 'ADMIN')
@Controller('user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  /**
   * Assigns a role to a user.
   * @route PATCH user-roles/update/:userId
   */

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  async changeRole(@Body() id: string, @Body() roleName: RoleName) {
    try {
      await this.userRoleService.changeRole(id, roleName);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Gets all roles assigned to a user.
   * @route GET user-roles/:userId
   */
  @Get(':id')
  async getRolesForUser(@Param('id') id: string) {
    try {
      return await this.userRoleService.getRolesForUser(id);
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

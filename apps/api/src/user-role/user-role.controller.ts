import {
  Controller,
  Body,
  InternalServerErrorException,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserRoleService } from './user-role.service';
import { Roles } from './decorator';
import { RoleName } from '@prisma/client';
import { RolesGuard } from './guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user-roles')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  /**
   * Assigns a role to a user.
   * @route PATCH user-roles/update/
   */

  @Patch('update')
  @Roles('SUPER')
  @HttpCode(HttpStatus.OK)
  async changeRole(
    @Body('id') id: string,
    @Body('roleName') roleName: RoleName,
  ) {
    try {
      await this.userRoleService.changeRole(id, roleName);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}

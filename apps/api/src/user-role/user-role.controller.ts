import {
  Controller,
  Body,
  InternalServerErrorException,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RtGuard } from '../common/guards';
import { Roles } from '../common/decorators';
import { RoleName } from '@prisma/client';
import { RolesGuard } from '../common/guards';

@UseGuards(RtGuard, RolesGuard)
@Controller('user-roles')
export class UserRoleController {
  constructor () { }

  /**
   * Assigns a role to a user.
   * @route PATCH user-roles/update/
   */

  @Patch('update')
  @Roles(RoleName.SUPER)
  @HttpCode(HttpStatus.OK)
  async changeRole(
    @Body('id') id: string,
    @Body('roleName') roleName: RoleName,
  ) {
    try {
      await this.changeRole(id, roleName);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}

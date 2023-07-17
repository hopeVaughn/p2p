import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Creates a new role.
   * @route POST /roles
   */
  @Post()
  async createRole(@Body('name') name: string) {
    try {
      return await this.roleService.createRole(name);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  /**
   * Fetches a role by its ID.
   * @route GET /roles/:id
   */
  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    try {
      return await this.roleService.getRoleById(id);
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
   * Deletes a role by its ID.
   * @route DELETE /roles/:id
   */
  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    try {
      await this.roleService.deleteRole(id);
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
}

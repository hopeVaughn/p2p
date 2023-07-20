import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { RolesGuard } from './guard';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
@Module({
  controllers: [UserRoleController],
  providers: [UserRoleService, JwtAuthGuard, RolesGuard],
})
export class UserRoleModule {}

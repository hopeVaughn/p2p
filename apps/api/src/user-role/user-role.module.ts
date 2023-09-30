import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { RolesGuard } from '../common/guards';
import { RtGuard } from '../common/guards';
@Module({
  controllers: [UserRoleController],
  providers: [UserRoleService, RtGuard, RolesGuard],
})
export class UserRoleModule { }

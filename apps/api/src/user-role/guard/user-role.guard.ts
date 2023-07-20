import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(
      'roleNames',
      context.getHandler(),
    );
    if (!roles) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRole = user.userRoles[0]?.role; // Directly access the user's role
    return roles.includes(userRole);
  }
}

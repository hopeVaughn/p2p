import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// src/user-role/guard/roles.guard.ts

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

    console.log('Roles from decorator: ', roles);
    console.log('User from request: ', user);

    const hasRole = () =>
      user.userRoles.some((role) => roles.includes(role.role));

    return user && user.userRoles && hasRole();
  }
}

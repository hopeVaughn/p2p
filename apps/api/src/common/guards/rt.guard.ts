import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

export class RtGuard extends AuthGuard('jwt-refresh') {

  constructor () {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add logging at the start of canActivate to check if guard is being called

    try {
      // Call the default canActivate method from AuthGuard
      return super.canActivate(context);
    } catch (error) {
      console.error('Error in RtGuard:', error.message);
      throw error;
    }
  }

  handleRequest(err, user, info) {
    // If an error is thrown within the guard, or if there is no user, throw UnauthorizedException
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}

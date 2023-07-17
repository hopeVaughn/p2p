/**
 * JwtAuthGuard class that extends the AuthGuard class from the @nestjs/passport module.
 * This class is used to protect routes that require authentication using JWT tokens.
 */
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}

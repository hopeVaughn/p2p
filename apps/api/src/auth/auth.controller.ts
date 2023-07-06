import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // api/auth/signup
  @Post('signup')
  signup() {
    return 'I am a new user signing up';
  }

  // api/auth/signin
  @Post('signin')
  signin() {
    return 'I am a user signing in';
  }
}

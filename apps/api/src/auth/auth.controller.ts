import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // api/auth/signup
  @Post('signup')
  signup(@Body() dto: unknown) {
    console.log({
      dto,
    });

    return this.authService.signup();
  }

  // api/auth/signin
  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}

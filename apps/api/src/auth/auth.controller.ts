import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint for user signup
   * @param dto - Data Transfer Object containing user signup information
   * @returns Promise containing the result of the signup operation
   */
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  /**
   * Endpoint for user signin
   * @param dto - Data Transfer Object containing user signin information
   * @returns Promise containing the result of the signin operation
   */
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  @UseGuards(AuthGuard('jwt')) // the parameter is the name of the strategy we defined in the JwtStrategy class and is by default 'jwt'
  @Get('me')
  getMe() {
    return { message: 'This action returns my profile' };
  }
}

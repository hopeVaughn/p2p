import { Controller, Get, UseGuards, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/';
import { JwtAuthGuard } from '../auth/guard';

@UseGuards(JwtAuthGuard) // the parameter is the name of the strategy we defined in the JwtStrategy class and is by default 'jwt'. Here we use a guard to protect the route.
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User, @GetUser('email') email: string) {
    return {
      id: user.id,
      email,
    };
  }
  @Patch()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  editUser() {}
}

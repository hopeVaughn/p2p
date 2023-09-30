import { Controller, Get, UseGuards, Patch } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetCurrentUser } from '../common/decorators';
import { RtGuard } from '../common/guards';

@UseGuards(RtGuard) // the parameter is the name of the strategy we defined in the JwtStrategy class and is by default 'jwt'. Here we use a guard to protect the route.
@Controller('users')
export class UserController {
  @Get('me')
  getMe(@GetCurrentUser() user: User, @GetCurrentUser('email') email: string) {
    return {
      id: user.id,
      email,
    };
  }
  @Patch()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  editUser() { }
}

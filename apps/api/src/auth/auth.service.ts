import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // generate password
    const hash = await argon.hash(dto.password);
    // save user to db
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
    });
    delete user.password;
    // return saved user
    return user;
  }

  signin() {
    return { message: 'I am a user signing in' };
  }
}

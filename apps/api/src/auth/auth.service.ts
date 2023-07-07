import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // generate password
    const hash = await argon.hash(dto.password);
    // save user to db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });
      delete user.password;
      // return saved user
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already exist');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user not found throw exception
    if (!user) {
      throw new ForbiddenException('Credentials not found');
    }
    // compare password
    const pwMatches = await argon.verify(user.password, dto.password);
    // if password is not correct throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials not found');
    }
    // send back user
    delete user.password;
    return user;
  }
}

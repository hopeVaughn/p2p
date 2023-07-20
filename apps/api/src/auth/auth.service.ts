import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, RoleName } from '@prisma/client';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Signup a new user with the provided email and password
   * @param dto - The AuthDto object containing the email and password
   * @returns A Promise that resolves to an object containing an access token
   * @throws ForbiddenException if the provided email already exists in the database
   */
  async signup(dto: AuthDto) {
    // generate password hash
    const hash = await argon.hash(dto.password);

    // save user to db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
        },
      });
      // create new user-role entry
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          role: RoleName.USER,
        },
      });

      // remove password from user object
      delete user.password;

      // return saved user's access token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already exist');
        }
      }
      throw error;
    }
  }

  /**
   * Signin a user with the provided email and password
   * @param dto - The AuthDto object containing the email and password
   * @returns A Promise that resolves to an object containing an access token
   * @throws ForbiddenException if the provided email or password is incorrect
   */
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
    // send back user's access token
    return this.signToken(user.id, user.email);
  }

  /**
   * Sign a JWT token with the provided user id and email
   * @param userId - The user id to sign the token with
   * @param email - The user email to sign the token with
   * @returns A Promise that resolves to an object containing an access token
   */
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}

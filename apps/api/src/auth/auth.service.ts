import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Tokens, JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor (
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) { }

  // Sign Up
  async signUp(dto: AuthDto): Promise<Tokens> {
    // generate password hash
    const hash = await argon.hash(dto.password);

    // save new user to database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
    }).catch((error) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException("NO FUNNY STUFF");
        }
      }
      throw error;
    });

    // generate tokens
    const tokens = await this.getTokens(user.id, user.email);
    // update refresh token hash for user
    await this.updateRtHash(user.id, tokens.refreshToken);
    // return tokens
    return tokens;
  }

  // Sign In
  async singIn(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    });

    if (!user) throw new ForbiddenException("that's a no scotty");

    // compare password hashed
    const passwordMatches = await argon.verify(user.password, dto.password);
    // throw new error if not matched
    if (!passwordMatches) throw new ForbiddenException('Still a nope');
    // generate tokens
    const tokens = await this.getTokens(user.id, user.email);
    // update refresh token hash for user
    await this.updateRtHash(user.id, tokens.refreshToken);
    // return tokens
    return tokens;

  }

  // Log out
  async logout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        }
      },
      data: {
        hashedRt: null,
      }
    });
    return true;
  }

  // Refresh
  async refresh(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  // Helper functions

  // hash data
  async hashData(data: string) {
    return await argon.hash(data);
  }

  // Create access and refresh tokens
  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>("AT_SECRET"),
        expiresIn: '15m'
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>("RT_SECRET"),
        expiresIn: '7d',
      })
    ]);
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  // Update the refresh token hash for a user
  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      }
    });
  }
}

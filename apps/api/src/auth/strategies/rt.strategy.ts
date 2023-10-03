import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor (
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies['refreshToken'], // Extract from the cookie
      secretOrKey: configService.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }
  async validate(req: Request) {
    console.log('Received cookies:', req.cookies);
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      console.log('No refreshToken found in cookies');
      return false;
    }

    try {
      // Verify the refreshToken
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('RT_SECRET'),
      });

      // Check if the refreshToken's jti exists in the database
      const storedToken = await this.prismaService.token.findFirst({
        where: {
          userId: decoded.sub,
          jti: decoded.jti,  // Use jti for lookup
        },
      });

      if (!storedToken) {
        console.log('Stored token not found in the database');
        return false;
      }

      // Attach the decoded payload to the request for later use
      req.user = decoded;

      console.log('Refresh token validation successful');
      return decoded;
    } catch (error) {
      console.error('Refresh token validation error:', error);
      return false;
    }
  }
}

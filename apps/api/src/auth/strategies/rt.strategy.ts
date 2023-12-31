import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

/**
 * This class represents the RtStrategy used for Passport authentication.
 * It extends the PassportStrategy class and uses the 'jwt-refresh' strategy.
 * The class extracts the refreshToken from the cookie and validates it.
 * If the validation is successful, the decoded payload is attached to the request for later use.
 */
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  /**
   * Creates an instance of RtStrategy.
   * @param {ConfigService} configService - The ConfigService instance.
   * @param {JwtService} jwtService - The JwtService instance.
   * @param {PrismaService} prismaService - The PrismaService instance.
   */
  constructor (
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.body.refreshToken, // Extract from the request body
      secretOrKey: configService.get<string>('RT_SECRET'),
      passReqToCallback: true,
    });
  }

  /**
   * Validates the refreshToken extracted from the cookie.
   * @param {Request} req - The request object.
   * @returns {Promise<boolean | object>} - Returns false if refreshToken is not found or invalid.
   * Returns the decoded payload if refreshToken is valid.
   */
  async validate(req: Request): Promise<boolean | object> {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
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
        return false;
      }

      // Attach the decoded payload to the request for later use
      req.user = decoded;

      return decoded;
    } catch (error) {
      return false;
    }
  }
}

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Tokens, JwtPayload } from './types';
import { RoleName } from '@prisma/client';

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

    // Step 1: Save new user to database without userRoleId
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      }
    }).catch((error) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials incorrect');
        }
      }
      throw error;
    });

    // Step 2: Create a UserRole record which will default to the 'USER' role and associate it with the user
    const userRole = await this.prisma.userRole.create({
      data: {
        userId: user.id,
        role: RoleName.USER // This can be omitted since we have a default, but added here for clarity
      },
    });

    // Step 3: Update the user with the userRoleId
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        roles: {
          connect: {
            id: userRole.id
          }
        }
      }
    });

    // generate tokens
    const tokens = await this.getTokens(user.id, user.email);
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    // Create a new entry in the Token table for the hashed refresh token
    await this.prisma.token.create({
      data: {
        userId: user.id,
        token: await this.hashData(tokens.refreshToken),
        expiry: expiryDate
      }
    });

    // return tokens
    return { ...tokens, expiry: expiryDate };
  }

  // Sign In
  async signIn(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    });

    if (!user) throw new ForbiddenException("Invalid Credentials");

    // compare password hashed
    const passwordMatches = await argon.verify(user.password, dto.password);
    // throw new error if not matched
    if (!passwordMatches) throw new ForbiddenException('Invalid Credentials');

    // Check if there's an existing refresh token for the user
    const existingToken = await this.prisma.token.findFirst({
      where: {
        userId: user.id,
      }
    });

    // If there's an existing token, delete it
    if (existingToken) {
      await this.prisma.token.delete({
        where: {
          id: existingToken.id,
        }
      });
    }

    // generate new tokens
    const tokens = await this.getTokens(user.id, user.email);
    const hashedRt = await this.hashData(tokens.refreshToken);
    console.log("Hashed refresh token during signIn:", hashedRt);
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    // Create a new entry in the Token table for the hashed refresh token
    await this.prisma.token.create({
      data: {
        userId: user.id,
        token: hashedRt,
        expiry: expiryDate
      }
    });

    return { ...tokens, expiry: expiryDate };
  }

  // Log out
  async logout(userId: string): Promise<boolean> {
    await this.prisma.token.deleteMany({
      where: {
        userId: userId,
      }
    });
    return true;
  }


  // Refresh
  async refresh(userId: string, oldRefreshToken: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    // Extract the jti from the old refresh token
    const oldRtDecoded: any = this.jwtService.decode(oldRefreshToken);
    const jti = oldRtDecoded.jti;
    const storedToken = await this.prisma.token.findFirst({
      where: {
        userId: userId,
        jti: jti,
      }
    });
    if (!storedToken) throw new ForbiddenException('Access Denied');
    if (!storedToken || !await argon.verify(storedToken.token, oldRefreshToken)) {
      console.log("Failed to verify old refresh token with stored hash");
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.getTokens(user.id, user.email);

    // Handle the refresh token: delete the old and store the new
    await this.handleRefreshToken(userId, oldRefreshToken, tokens.refreshToken);
    const expiryDate = await this.handleRefreshToken(userId, oldRefreshToken, tokens.refreshToken);
    return { ...tokens, expiry: expiryDate };
  }

  // Helper functions

  // hash data
  async hashData(data: string) {
    return await argon.hash(data);
  }

  // Create access and refresh tokens
  async getTokens(userId: string, email: string, jti?: string): Promise<Tokens> {
    // Fetch the user's roles from the database
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId: userId,
      },
      select: {
        role: true,
      }
    });

    const rolesArray = userRoles.map(ur => ur.role); // This will give you an array of roles

    // Construct the payload
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      roles: rolesArray,
    };
    if (jti) jwtPayload.jti = jti;

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

  // Handle the refresh token: delete the old one and create a new one
  async handleRefreshToken(userId: string, oldRt: string, newRt: string): Promise<Date> {
    if (oldRt) {
      // Extract the jti from the old refresh token
      const oldRtDecoded: any = this.jwtService.decode(oldRt);
      const jti = oldRtDecoded.jti;

      // Delete the old refresh token based on jti
      await this.prisma.token.deleteMany({
        where: {
          userId: userId,
          jti: jti,
        }
      });
    }

    // Extract the jti from the new refresh token
    const newRtDecoded: any = this.jwtService.decode(newRt);
    const newJti = newRtDecoded.jti;
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    // Create a new entry for the new refresh token
    await this.prisma.token.create({
      data: {
        userId: userId,
        token: await argon.hash(newRt),
        jti: newJti,
        expiry: expiryDate
      }
    });
    return expiryDate;
  }


}


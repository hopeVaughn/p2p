import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Tokens, JwtPayload } from './types';
import { RoleName } from '@prisma/client';
/**
 * Service for handling authentication related requests.
 */
@Injectable()
export class AuthService {
  constructor (
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) { }

  /* Start of route business logic */

  /**
   * Business logic for signup
   * @param dto - The authentication data transfer object.
   * @returns Promise with access token and refresh token.
   */

  async signUp(dto: AuthDto): Promise<Tokens> {
    // Step 1: Hash the provided password and save the new user in the database without a role.
    // Step 2: Assign a default 'USER' role to the newly created user.
    // Step 3: Connect the user to their role.
    // Step 4: Generate access and refresh tokens for the user.
    // Step 5: Save the hashed refresh token in the database.
    // Step 6: Return the generated tokens.


    // 1. Hash the provided password and save the new user in the database without a role.
    const hash = await argon.hash(dto.password);

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

    // Step 2: Assign a default 'USER' role to the newly created user.
    const userRole = await this.prisma.userRole.create({
      data: {
        userId: user.id,
        role: RoleName.USER // This can be omitted since we have a default, but added here for clarity
      },
    });

    // Step 3: Connect the user to their role.
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

    // Step 4: Generate access and refresh tokens for the user.
    const tokens = await this.getTokens(user.id, user.email);
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Step 5: Save the hashed refresh token in the database.
    await this.prisma.token.create({
      data: {
        userId: user.id,
        token: await this.hashData(tokens.refreshToken),
        expiry: expiryDate
      }
    });

    // Step 6: Return the generated tokens.
    return { ...tokens };
  }

  /**
   * Business logic for sign-in
   * @param dto - The authentication data transfer object.
   * @returns - Promise with access token and refresh token.
   */

  async signIn(dto: AuthDto): Promise<Tokens> {
    // Step 1: Fetch the user from the database based on the provided email and check if the user exists, if not, throw an error.
    // Step 2: Verify if the provided password matches the hashed password in the database.
    // Step 3: Check for existing tokens attached to the user and delete any existing refresh tokens.
    // Step 4: Generate and hash new refresh and access token.
    // Step 6: Save the hashed refresh token in the database.
    // Step 7: Return the generated tokens.

    // 1. Fetch the user from the database based on the provided email.
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      }
    });

    if (!user) throw new ForbiddenException("Invalid Credentials");

    // 2. Verify if the provided password matches the hashed password in the database.
    const passwordMatches = await argon.verify(user.password, dto.password);
    // throw new error if not matched
    if (!passwordMatches) throw new ForbiddenException('Invalid Credentials');

    // 3. Check for existing tokens attached to the user and delete any existing refresh tokens.
    const existingToken = await this.prisma.token.findFirst({
      where: {
        userId: user.id,
      }
    });

    if (existingToken) {
      await this.prisma.token.delete({
        where: {
          id: existingToken.id,
        }
      });
    }

    // 4. Generate new access and refresh tokens.
    const tokens = await this.getTokens(user.id, user.email);
    const hashedRt = await this.hashData(tokens.refreshToken);
    console.log("Hashed refresh token during signIn:", hashedRt);
    const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // 5. Save the hashed refresh token in the database.
    await this.prisma.token.create({
      data: {
        userId: user.id,
        token: hashedRt,
        expiry: expiryDate
      }
    });

    // 6. Return the generated tokens.
    return { ...tokens };
  }

  /**
   * Business logic for logout
   * @param userId - The user ID.
   * @returns - Promise with boolean.
   */

  async logout(userId: string): Promise<boolean> {
    // Step 1: Delete all refresh tokens for the user.
    // Step 2: Return true indicating successful logout.
    await this.prisma.token.deleteMany({
      where: {
        userId: userId,
      }
    });
    return true;
  }


  /**
   * Business logic for refresh
   * @param userId - The user ID.
   * @param oldRefreshToken - The old refresh token.
   * @returns - Promise with access token and refresh token.
  */

  async refresh(userId: string, oldRefreshToken: string): Promise<Tokens> {
    // Step 1: Find the user by the provided user ID.
    // Step 2: Decode the old refresh token to get the JWT ID (jti).
    // Step 3: Verify if the decoded token's JWT ID and hashed value are stored in the database.
    // Step 4: If not found, throw an error.
    // Step 5. Compare the old refresh token with the stored hash
    // Step 6: Generate new access and refresh tokens.
    // Step 7: Handle the storage and deletion of old and new refresh tokens.
    // Step 8: Return the newly generated tokens.

    // 1. Find the user by the provided user ID.
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ForbiddenException('Access Denied');

    // 2. Decode the old refresh token to get the JWT ID (jti).
    const oldRtDecoded: any = this.jwtService.decode(oldRefreshToken);
    const jti = oldRtDecoded.jti;

    // 3. Verify if the decoded token's JWT ID and hashed value are stored in the database.
    const storedToken = await this.prisma.token.findFirst({
      where: {
        userId: userId,
        jti: jti,
      }
    });

    // 4. If not found, throw an error.
    if (!storedToken) throw new ForbiddenException('Access Denied');

    // 5. Compare the old refresh token with the stored hash
    if (!storedToken || !await argon.verify(storedToken.token, oldRefreshToken)) {
      console.log("Failed to verify old refresh token with stored hash");
      throw new ForbiddenException('Access Denied');
    }

    // 6. Generate new access and refresh tokens.
    const tokens = await this.getTokens(user.id, user.email);

    // 7. Handle the storage and deletion of old and new refresh tokens.
    await this.handleRefreshToken(userId, oldRefreshToken, tokens.refreshToken);

    // 8. Return the newly generated tokens.
    return { ...tokens };
  }

  /* End of business logic for routes */

  /*--------------------------------------------------------------------------- */
  /* Start of Helper Functions */
  /**
    * Hash data using argon2
    * @param data - Any data to be hashed using argon2
    * @returns 
    */

  // hash data
  async hashData(data: string) {
    return await argon.hash(data);
  }

  /**
   * Create access and refresh tokens
   * @param userId - The user ID.
   * @param email - The user email.
   * @param jti - The JWT ID.
   * @returns - Promise with access token and refresh token.
   */

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

  /**
   * Handle the refresh token: delete the old one and create a new one
   * @param userId - The user ID.
   * @param oldRt - The old refresh token.
   * @param newRt - The new refresh token.
   */

  async handleRefreshToken(userId: string, oldRt: string, newRt: string): Promise<void> {
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
  }
  /* End of Helper Functions */
}


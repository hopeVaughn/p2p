import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Public, GetCurrentUserId } from '../common/decorators';
import { RtGuard } from '../common/guards';
import { ConfigService } from '@nestjs/config';
@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService, private config: ConfigService) { }

  // api/auth/signup
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: AuthDto, @Res() response: Response): Promise<Response> {
    const tokens = await this.authService.signUp(dto);

    const isLocal = this.config.get<string>('IS_LOCAL') === 'true';
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: !isLocal, // set to true if in production
      sameSite: 'strict'
    });

    return response.send({
      accessToken: tokens.accessToken,
      refreshExpiry: tokens.expiry
    });
  }

  // api/auth/signin
  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto, @Res() response: Response): Promise<Response> {
    const tokens = await this.authService.signIn(dto);

    const isLocal = this.config.get<string>('IS_LOCAL') === 'true';
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: !isLocal, // set to true if in production
      sameSite: 'strict'
    });

    // can either send the accessToken in the response body or as another cookie.
    return response.send({
      accessToken: tokens.accessToken,
      refreshExpiry: tokens.expiry
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: string, @Res() response: Response): Promise<Response> {
    await this.authService.logout(userId);

    const isLocal = this.config.get<string>('IS_LOCAL') === 'true';
    response.cookie('refreshToken', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: !isLocal, // set to true if in production
      sameSite: 'strict'
    });

    return response.send({ message: 'Logged out successfully' });
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUserId() userId: string,
    @Res() response: Response
  ): Promise<Response> {
    const oldRefreshToken = response.req.cookies['refreshToken']; // Extract directly from the cookies
    console.log('Old refresh token:', oldRefreshToken);

    const tokens = await this.authService.refresh(userId, oldRefreshToken);
    const isLocal = this.config.get<string>('IS_LOCAL') === 'true';
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: !isLocal,
      sameSite: 'strict'
    });

    return response.send({
      accessToken: tokens.accessToken,
      refreshExpiry: tokens.expiry
    });
  }
}
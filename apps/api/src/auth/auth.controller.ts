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
import { Public, GetCurrentUser, GetCurrentUserId } from '../common/decorators';
import { RtGuard } from '../common/guards';
@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) { }

  // api/auth/signup
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: AuthDto, @Res() response: Response): Promise<Response> {
    const tokens = await this.authService.signUp(dto);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return response.send({ accessToken: tokens.accessToken });
  }

  // api/auth/signin
  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto, @Res() response: Response): Promise<Response> {
    const tokens = await this.authService.signIn(dto);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set to true if in production
      sameSite: 'strict'
    });

    // can either send the accessToken in the response body or as another cookie.
    return response.send({ accessToken: tokens.accessToken });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: string, @Res() response: Response): Promise<Response> {
    await this.authService.logout(userId);

    response.cookie('refreshToken', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
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
    @GetCurrentUser('refreshToken') oldRefreshToken: string,
    @Res() response: Response
  ): Promise<Response> {
    const tokens = await this.authService.refresh(userId, oldRefreshToken);

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return response.send({ accessToken: tokens.accessToken });
  }
}
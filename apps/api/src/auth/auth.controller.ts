import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Public, GetCurrentUserId } from '../common/decorators';
/**
 * Controller for handling authentication related requests.
 */
@Controller('auth')
export class AuthController {
  constructor (
    private authService: AuthService) { }

  /**
   * Endpoint for user signup.
   * @param dto - The authentication data transfer object.
   * @param response - The HTTP response object.
   * @returns The HTTP response with access token and refresh token cookie.
   */
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: AuthDto, @Res() response: Response): Promise<Response> {
    // Step 1: Call the signUp method from AuthService.
    // Step 2: Check if the environment is local (development) or production.
    // Step 3: Set a secure httpOnly cookie for the refresh token.
    // Step 4: Send the access token in the response body.
    const tokens = await this.authService.signUp(dto);
    return response.send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  /**
   * Endpoint for user signin.
   * @param dto - The authentication data transfer object.
   * @param response - The HTTP response object.
   * @returns The HTTP response with access token and refresh token cookie.
   */
  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto, @Res() response: Response): Promise<Response> {
    const tokens = await this.authService.signIn(dto);
    return response.send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  /**
   * Endpoint for user logout.
   * @param userId - The user ID.
   * @param response - The HTTP response object.
   * @returns The HTTP response with empty refresh token cookie.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('refreshToken') refreshToken: string, @Res() response: Response): Promise<Response> {
    await this.authService.logout(refreshToken);
    return response.send({ message: 'Logged out successfully' });
  }

  /**
    * Endpoint for refreshing access token.
    * @param userId - The user ID.
    * @param response - The HTTP response object.
    * @returns The HTTP response with new access token and refresh token cookie.
    */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Res() response: Response,
  ): Promise<Response> {
    const tokens = await this.authService.refresh(refreshToken);

    return response.send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
}
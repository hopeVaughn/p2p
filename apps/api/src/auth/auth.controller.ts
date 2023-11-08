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
/**
 * Controller for handling authentication related requests.
 */
@Controller('auth')
export class AuthController {
  constructor (
    private authService: AuthService,
    private config: ConfigService) { }


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

    // const isLocal = this.config.get<string>('IS_LOCAL') === 'true';
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      // domain: 'placetopee.netlify.app'
    });

    return response.send({
      accessToken: tokens.accessToken,
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
    // Step 1: Call the signIn method from AuthService.
    // Step 2: Check if the environment is local (development) or production.
    // Step 3: Set a secure httpOnly cookie for the refresh token.
    // Step 4: Send the access token in the response body.
    const tokens = await this.authService.signIn(dto);

    // const isLocal = this.config.get<string>('IS_LOCAL') === 'true';
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      // domain: 'placetopee.netlify.app'
    });

    // can either send the accessToken in the response body or as another cookie.
    return response.send({
      accessToken: tokens.accessToken,
    });
  }

  /**
   * Endpoint for user logout.
   * @param userId - The user ID.
   * @param response - The HTTP response object.
   * @returns The HTTP response with empty refresh token cookie.
   */
  // @UseGuards(RtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: string, @Res() response: Response): Promise<Response> {
    // Step 1: Call the logout method from AuthService.
    // Step 2: Check if the environment is local (development) or production.
    // Step 3: Clear the refresh token by setting an empty cookie that is expired.
    // Step 4: Send a success message in the response body.

    await this.authService.logout(userId);

    // const isLocal = this.config.get<string>('IS_LOCAL') === 'true';
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookie('refreshToken', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      // domain: 'placetopee.netlify.app'
    });

    return response.send({ message: 'Logged out successfully' });
  }

  /**
    * Endpoint for refreshing access token.
    * @param userId - The user ID.
    * @param response - The HTTP response object.
    * @returns The HTTP response with new access token and refresh token cookie.
    */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body('accessToken') accessToken: string, // Accept accessToken from the body
    @Res() response: Response,
  ): Promise<Response> {
    // Pass the access token to the service method
    const tokens = await this.authService.refresh(accessToken);

    // Send the new access token in the response body
    return response.send({
      accessToken: tokens.accessToken,
    });
  }


}
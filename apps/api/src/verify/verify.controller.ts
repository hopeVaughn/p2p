import {
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Param,
  Body,
  Get,
} from '@nestjs/common';
import { VerifyService } from './verify.service';
import { RtGuard } from '../common/guards';
import { Public } from '../common/decorators';
import { VerifyDto } from './dto';

/**
 * Controller responsible for handling verification requests.
 */
@Controller('verify')
export class VerifyController {
  constructor (private readonly verifyService: VerifyService) { }

  /**
   * Endpoint for verifying a bathroom.
   * @param bathroomId - The ID of the bathroom to verify.
   * @param user - The authenticated user making the request.
   * @returns The result of the verification.
   */
  @Public()
  @UseGuards(RtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async verify(@Body() dto: VerifyDto) {
    return this.verifyService.verify(dto);
  }

  @Public()
  @UseGuards(RtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getVerifications(@Body() bathroomID: string) {
    return this.verifyService.countVerifications(bathroomID);
  }
}

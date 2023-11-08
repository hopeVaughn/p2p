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
import { GetCurrentUserId, Public } from '../common/decorators';
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
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async verify(@Body() dto: VerifyDto, @GetCurrentUserId() verifiedById: string) {
    return this.verifyService.verify(dto, verifiedById);
  }

  /**
   * Endpoint for getting the number of verifications for a bathroom.
   * @param bathroomID - The ID of the bathroom to get the verifications for.
   * @returns The number of verifications for the bathroom.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getVerifications(@Body() bathroomID: string) {
    return this.verifyService.countVerifications(bathroomID);
  }
}

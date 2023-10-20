import {
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Param,
} from '@nestjs/common';
import { VerifyService } from './verify.service';
import { RtGuard } from '../common/guards';
import { GetCurrentUserId, Public } from '../common/decorators';
import { User } from '@prisma/client';

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
  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  async verify(@Param('id') bathroomId: string, @GetCurrentUserId() userId: string) {
    return this.verifyService.verify(bathroomId, userId);
  }
}

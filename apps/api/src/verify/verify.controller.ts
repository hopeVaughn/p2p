import {
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Param,
} from '@nestjs/common';
import { VerifyService } from './verify.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async verify(@Param('id') bathroomId: string, @GetUser() user: User) {
    return this.verifyService.verify(bathroomId, user.id);
  }
}

import {
  Controller,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyDto } from './dto/verify.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('verify')
export class VerifyController {
  constructor(private readonly verifyService: VerifyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async verify(@Body() verifyDto: VerifyDto) {
    return this.verifyService.verify(verifyDto);
  }
}

import { Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { JwtAuthGuard } from '../auth/guard';
@Module({
  controllers: [VerifyController],
  providers: [VerifyService, JwtAuthGuard],
})
export class VerifyModule {}

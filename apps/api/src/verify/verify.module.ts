import { Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';

@Module({
  controllers: [VerifyController],
  providers: [VerifyService],
})
export class VerifyModule {}

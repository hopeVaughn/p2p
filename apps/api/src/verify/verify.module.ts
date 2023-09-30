import { Module } from '@nestjs/common';
import { VerifyService } from './verify.service';
import { VerifyController } from './verify.controller';
import { RtGuard } from '../common/guards';
@Module({
  controllers: [VerifyController],
  providers: [VerifyService, RtGuard],
})
export class VerifyModule { }

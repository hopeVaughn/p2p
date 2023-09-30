import { Module } from '@nestjs/common';
import { UserReportController } from './user-report.controller';
import { UserReportService } from './user-report.service';
import { RtGuard } from '../common/guards';
@Module({
  controllers: [UserReportController],
  providers: [UserReportService, RtGuard],
})
export class UserReportModule { }

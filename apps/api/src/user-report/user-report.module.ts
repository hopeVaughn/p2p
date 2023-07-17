import { Module } from '@nestjs/common';
import { UserReportController } from './user-report.controller';
import { UserReportService } from './user-report.service';
@Module({
  controllers: [UserReportController],
  providers: [UserReportService],
})
export class UserReportModule {}

import { Module } from '@nestjs/common';
import { UserReportController } from './user-report.controller';
import { UserReportService } from './user-report.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
@Module({
  controllers: [UserReportController],
  providers: [UserReportService, JwtAuthGuard],
})
export class UserReportModule {}

import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
@Module({
  controllers: [ReportController],
  providers: [ReportService, JwtAuthGuard],
})
export class ReportModule {}

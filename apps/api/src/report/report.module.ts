import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { RtGuard } from '../common/guards';
@Module({
  controllers: [ReportController],
  providers: [ReportService, RtGuard],
})
export class ReportModule { }

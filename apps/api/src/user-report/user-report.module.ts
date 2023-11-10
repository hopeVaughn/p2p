import { Module } from '@nestjs/common';
import { UserReportController } from './user-report.controller';
import { UserReportService } from './user-report.service';
import { RtGuard } from '../common/guards';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [AuthModule],
  controllers: [UserReportController],
  providers: [UserReportService, RtGuard],
})
export class UserReportModule { }

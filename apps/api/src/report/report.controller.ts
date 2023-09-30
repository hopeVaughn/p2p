import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/report.dto';
import { RtGuard } from 'src/common/guards';

@Controller('report')
@UseGuards(RtGuard)
export class ReportController {
  constructor (private readonly reportService: ReportService) { }

  /**
   * Endpoint for creating a new report.
   * @param dto - Data transfer object containing the report information.
   * @returns The newly created report.
   */
  @Post()
  async createReport(@Body() dto: CreateReportDto) {
    return this.reportService.createReport(dto);
  }
}

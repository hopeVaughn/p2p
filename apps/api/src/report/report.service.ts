import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/report.dto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}
  /**
   * Creates a new report in the database.
   * @param dto - The data transfer object containing the report information.
   * @returns A Promise that resolves to the created report.
   */

  async createReport(dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        bathroomId: dto.bathroomId,
        reportedById: dto.reportedById,
        reason: dto.reason,
      },
    });
  }
}

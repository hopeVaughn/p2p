import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserReportDto } from './dto/user-report.dto';

@Injectable()
export class UserReportService {
  constructor(private prisma: PrismaService) {}

  async createUserReport(dto: CreateUserReportDto) {
    return this.prisma.userReport.create({
      data: {
        userId: dto.userId,
        reportId: dto.reportId,
      },
    });
  }

  async findUserReportsByUserId(userId: string) {
    return this.prisma.userReport.findMany({
      where: { userId },
    });
  }

  async updateUserReport(id: string, dto: CreateUserReportDto) {
    return this.prisma.userReport.update({
      where: { id },
      data: {
        userId: dto.userId,
        reportId: dto.reportId,
      },
    });
  }

  async deleteUserReport(id: string) {
    return this.prisma.userReport.delete({
      where: { id },
    });
  }
}

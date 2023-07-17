import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserReportDto } from './dto/user-report.dto';

@Injectable()
export class UserReportService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new user report.
   * @param dto - The data for the new user report.
   * @returns The newly created user report.
   */
  async createUserReport(dto: CreateUserReportDto) {
    return this.prisma.userReport.create({
      data: {
        userId: dto.userId,
        reportId: dto.reportId,
      },
    });
  }

  /**
   * Finds all user reports for a given user ID.
   * @param userId - The ID of the user to find reports for.
   * @returns An array of user reports for the given user ID.
   */
  async findUserReportsByUserId(userId: string) {
    return this.prisma.userReport.findMany({
      where: { userId },
    });
  }

  /**
   * Updates an existing user report.
   * @param id - The ID of the user report to update.
   * @param dto - The new data for the user report.
   * @returns The updated user report.
   */
  async updateUserReport(id: string, dto: CreateUserReportDto) {
    return this.prisma.userReport.update({
      where: { id },
      data: {
        userId: dto.userId,
        reportId: dto.reportId,
      },
    });
  }

  /**
   * Deletes a user report.
   * @param id - The ID of the user report to delete.
   * @returns The deleted user report.
   */
  async deleteUserReport(id: string) {
    return this.prisma.userReport.delete({
      where: { id },
    });
  }
}

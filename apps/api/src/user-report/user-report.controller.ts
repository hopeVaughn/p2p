import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserReportService } from './user-report.service';
import { CreateUserReportDto } from './dto/user-report.dto';
import { RtGuard } from '../common/guards';

// This controller handles HTTP requests related to user reports
@Controller('user-report')
// This controller requires authentication via JWT
@UseGuards(RtGuard)
export class UserReportController {
  constructor (private readonly userReportService: UserReportService) { }

  /**
   * Handles POST requests to create a new user report
   * @param dto - The data transfer object containing the user report information
   * @returns The newly created user report
   */
  @Post()
  async createUserReport(@Body() dto: CreateUserReportDto) {
    return this.userReportService.createUserReport(dto);
  }

  /**
   * Handles GET requests to retrieve user reports by user ID
   * @param userId - The ID of the user whose reports are being retrieved
   * @returns The user reports associated with the specified user ID
   */
  @Get(':userId')
  async findUserReportsByUserId(@Param('userId') userId: string) {
    return this.userReportService.findUserReportsByUserId(userId);
  }

  /**
   * Handles PUT requests to update an existing user report
   * @param id - The ID of the user report being updated
   * @param dto - The data transfer object containing the updated user report information
   * @returns The updated user report
   */
  @Put(':id')
  async updateUserReport(
    @Param('id') id: string,
    @Body() dto: CreateUserReportDto,
  ) {
    return this.userReportService.updateUserReport(id, dto);
  }

  /**
   * Handles DELETE requests to delete an existing user report
   * @param id - The ID of the user report being deleted
   * @returns The deleted user report
   */
  @Delete(':id')
  async deleteUserReport(@Param('id') id: string) {
    return this.userReportService.deleteUserReport(id);
  }
}

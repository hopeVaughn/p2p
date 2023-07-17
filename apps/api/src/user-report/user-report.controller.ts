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
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

// This controller handles HTTP requests related to user reports
@Controller('user-report')
// This controller requires authentication via JWT
@UseGuards(JwtAuthGuard)
export class UserReportController {
  constructor(private readonly userReportService: UserReportService) {}

  // This route handles POST requests to create a new user report
  @Post()
  async createUserReport(@Body() dto: CreateUserReportDto) {
    return this.userReportService.createUserReport(dto);
  }

  // This route handles GET requests to retrieve user reports by user ID
  @Get(':userId')
  async findUserReportsByUserId(@Param('userId') userId: string) {
    return this.userReportService.findUserReportsByUserId(userId);
  }

  // This route handles PUT requests to update an existing user report
  @Put(':id')
  async updateUserReport(
    @Param('id') id: string,
    @Body() dto: CreateUserReportDto,
  ) {
    return this.userReportService.updateUserReport(id, dto);
  }

  // This route handles DELETE requests to delete an existing user report
  @Delete(':id')
  async deleteUserReport(@Param('id') id: string) {
    return this.userReportService.deleteUserReport(id);
  }
}

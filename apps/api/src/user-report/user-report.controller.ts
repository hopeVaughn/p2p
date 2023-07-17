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

@Controller('user-report')
@UseGuards(JwtAuthGuard)
export class UserReportController {
  constructor(private readonly userReportService: UserReportService) {}

  @Post()
  async createUserReport(@Body() dto: CreateUserReportDto) {
    return this.userReportService.createUserReport(dto);
  }

  @Get(':userId')
  async findUserReportsByUserId(@Param('userId') userId: string) {
    return this.userReportService.findUserReportsByUserId(userId);
  }

  @Put(':id')
  async updateUserReport(
    @Param('id') id: string,
    @Body() dto: CreateUserReportDto,
  ) {
    return this.userReportService.updateUserReport(id, dto);
  }

  @Delete(':id')
  async deleteUserReport(@Param('id') id: string) {
    return this.userReportService.deleteUserReport(id);
  }
}

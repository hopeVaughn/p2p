import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BathroomService } from './bathroom.service';
import { CreateBathroomDto, UpdateBathroomDto } from './dto/bathroom.dto';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@Controller('bathroom')
export class BathroomController {
  constructor(private readonly bathroomService: BathroomService) {}

  // Create a new bathroom. This route is protected, and only authenticated users can access it.
  @Post('add_bathroom')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBathroomDto: CreateBathroomDto) {
    return this.bathroomService.create(createBathroomDto);
  }

  // Get a list of all bathrooms. This route is public.
  @Get('all_bathrooms')
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.bathroomService.findAll();
  }

  // Get a specific bathroom by its ID. This route is public.
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.bathroomService.findOne(id);
  }

  // Update a specific bathroom. This route is protected, and only authenticated users can access it.
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateBathroomDto: UpdateBathroomDto,
  ) {
    return this.bathroomService.update(id, updateBathroomDto);
  }

  // Delete a specific bathroom. This route is protected, and only authenticated users can access it.
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.bathroomService.remove(id);
  }
}

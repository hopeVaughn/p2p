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
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { RatingService } from 'src/rating/rating.service';

@Controller('bathroom')
export class BathroomController {
  constructor(
    private readonly bathroomService: BathroomService,
    private ratingService: RatingService,
  ) {}

  // Create a new bathroom. This route is protected, and only authenticated users can access it.
  @Post('add_bathroom')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBathroomDto: CreateBathroomDto) {
    const bathroom = await this.bathroomService.create(createBathroomDto);

    // Update the average stars for the created bathroom
    await this.ratingService.updateAverageStars(bathroom.id);

    return bathroom;
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

  // Verify a specific bathroom. This route is protected, and only authenticated users can access it.
  @Patch('verify/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  verify(@Param('id') id: string, @GetUser() user: User) {
    return this.bathroomService.verify(id, user.id);
  }

  // Delete a specific bathroom. This route is protected, and only authenticated users can access it.
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.bathroomService.remove(id, user.id);
  }
}

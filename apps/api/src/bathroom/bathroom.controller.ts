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
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { RatingService } from '../rating/rating.service';

@Controller('bathroom')
export class BathroomController {
  constructor(
    private readonly bathroomService: BathroomService,
    private ratingService: RatingService,
  ) {}

  /**
   * Create a new bathroom. This route is protected, and only authenticated users can access it.
   * @param createBathroomDto - The DTO containing the data for the new bathroom
   * @returns The newly created bathroom
   */
  @Post('add_bathroom')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBathroomDto: CreateBathroomDto) {
    const bathroom = await this.bathroomService.create(createBathroomDto);

    // Update the average stars for the created bathroom
    await this.ratingService.updateAverageStars(bathroom.id);

    return bathroom;
  }

  /**
   * Get a list of all bathrooms. This route is public.
   * @returns A list of all bathrooms
   */
  @Get('all_bathrooms')
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.bathroomService.findAll();
  }

  /**
   * Get a specific bathroom by its ID. This route is public.
   * @param id - The ID of the bathroom to retrieve
   * @returns The bathroom with the specified ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.bathroomService.findOne(id);
  }

  /**
   * Update a specific bathroom. This route is protected, and only authenticated users can access it.
   * @param id - The ID of the bathroom to update
   * @param updateBathroomDto - The DTO containing the updated data for the bathroom
   * @returns The updated bathroom
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateBathroomDto: UpdateBathroomDto,
  ) {
    return await this.bathroomService.update(id, updateBathroomDto);
  }

  /**
   * Delete a specific bathroom. This route is protected, and only authenticated users can access it.
   * @param id - The ID of the bathroom to delete
   * @param user - The authenticated user making the request
   * @returns Nothing
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return await this.bathroomService.remove(id, user.id);
  }
}

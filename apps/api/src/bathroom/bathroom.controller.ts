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
import { GetCurrentUserId } from '../common/decorators';
import { RatingService } from '../rating/rating.service';
import { RtGuard } from 'src/common/guards';
import { Public } from '../common/decorators/public.decorator';

@Controller('bathroom')
export class BathroomController {
  constructor (
    private readonly bathroomService: BathroomService,
    private ratingService: RatingService,
  ) { }

  /**
   * Create a new bathroom. This route is protected, and only authenticated users can access it.
   * @param createBathroomDto - The DTO containing the data for the new bathroom
   * @returns The newly created bathroom
   */

  @Post('add_bathroom')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBathroomDto: CreateBathroomDto) {
    const bathroom = await this.bathroomService.createWithLocation(createBathroomDto);

    // Update the average stars for the created bathroom
    // await this.ratingService.updateAverageStars(bathroom.id);

    return bathroom;
  }

  /**
   * Get a list of all bathrooms. This route is public.
   * @returns A list of all bathrooms
   */

  @Post('nearby')
  @HttpCode(HttpStatus.OK)
  findNearby(@Body('lat') lat: number, @Body('lng') lng: number, @Body('radius') radius: number) {
    return this.bathroomService.findNearby(lat, lng, radius);
  }
  /**
   * Get a specific bathroom by its ID. This route is public.
   * @param id - The ID of the bathroom to retrieve
   * @returns The bathroom with the specified ID
   */
  @Public()
  @UseGuards(RtGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Body('id') id: string) {
    return this.bathroomService.findOne(id);
  }

  /**
   * Update a specific bathroom. This route is protected, and only authenticated users can access it.
   * @param id - The ID of the bathroom to update
   * @param updateBathroomDto - The DTO containing the updated data for the bathroom
   * @returns The updated bathroom
   */
  @Patch('update_location/:id')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async updateLocation(
    @Param('id') id: string,
    @Body('lat') lat: number,
    @Body('lng') lng: number,
  ) {
    return await this.bathroomService.updateLocation(id, lat, lng);
  }
  /**
   * Delete a specific bathroom. This route is protected, and only authenticated users can access it.
   * @param id - The ID of the bathroom to delete
   * @param user - The authenticated user making the request
   * @returns Nothing
   */
  @Public()
  @UseGuards(RtGuard)
  @Delete('delete_bathroom/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return await this.bathroomService.remove(id, userId);
  }
}

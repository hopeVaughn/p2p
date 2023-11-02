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
  Query,
} from '@nestjs/common';
import { BathroomService } from './bathroom.service';
import { CreateBathroomDto, UpdateBathroomDto } from './dto/bathroom.dto';
import { GetCurrentUserId } from '../common/decorators';
import { RtGuard } from '../common/guards';
import { Public } from '../common/decorators/public.decorator';

@Controller('bathroom')
export class BathroomController {
  constructor (
    private readonly bathroomService: BathroomService,
  ) { }

  /**
   * Confirm the the user is the creator of the bathroom
   * @param bathroomId 
   * @param userId 
   * @returns Boolean indicating whether the user is the creator of the bathroom
   */
  @Get('confirm')
  @HttpCode(HttpStatus.OK)
  async confirm(@Query('bathroomId') bathroomId: string, @GetCurrentUserId() userId: string) {
    return await this.bathroomService.isCreator(bathroomId, userId);
  }


  /**
   * Create a new bathroom. This route is protected, and only authenticated users can access it.
   * @param createBathroomDto - The DTO containing the data for the new bathroom
   * @returns The newly created bathroom
   */

  @Post('add_bathroom')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBathroomDto: CreateBathroomDto) {
    const bathroom = await this.bathroomService.createWithLocation(createBathroomDto);

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
  // @Public()
  // @UseGuards(RtGuard)
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
  // @Public()
  // @UseGuards(RtGuard)
  @Patch('update_location/:id')
  @HttpCode(HttpStatus.OK)
  async updateLocation(
    @Param('id') bathroomId: string,
    @GetCurrentUserId() userId: string,
    @Body() dto: UpdateBathroomDto,

  ) {
    return await this.bathroomService.updateLocation(bathroomId, userId, dto);
  }
  /**
   * Delete a specific bathroom. This route is protected, and only authenticated users can access it.
   * @param id - The ID of the bathroom to delete
   * @param user - The authenticated user making the request
   * @returns Nothing
   */
  // @Public()
  // @UseGuards(RtGuard)
  @Delete('delete_bathroom')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBathroom(@Body('bathroomId') bathroomId: string, @GetCurrentUserId() userId: string) {
    return await this.bathroomService.deleteBathroom(bathroomId, userId);
  }
}

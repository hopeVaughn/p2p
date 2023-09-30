import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto, UpdateRatingDto } from './dto/rating.dto';
import { RtGuard } from 'src/common/guards';

@Controller('rating')
export class RatingController {
  constructor (private readonly ratingService: RatingService) { }

  /**
   * Create a new rating.
   * @param createRatingDto The data to create the rating.
   * @returns The created rating.
   */
  @Post()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.create(createRatingDto);
  }

  /**
   * Update an existing rating.
   * @param id The ID of the rating to update.
   * @param updateRatingDto The data to update the rating.
   * @returns The updated rating.
   */
  @Patch(':id')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateRatingDto: UpdateRatingDto) {
    const ratedById = updateRatingDto.ratedById;
    return this.ratingService.update(id, ratedById, updateRatingDto);
  }
}

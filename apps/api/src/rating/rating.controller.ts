import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/rating.dto';
import { RtGuard } from 'src/common/guards';
import { Public } from 'src/common/decorators';


@Controller('rating')
export class RatingController {
  constructor (private readonly ratingService: RatingService) { }

  /**
   * Create a new rating.
   * @param createRatingDto The data to create the rating.
   * @returns The created rating.
   */
  @Public()
  @UseGuards(RtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrUpdate(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.createOrUpdate(createRatingDto);
  }
}

import { Module } from '@nestjs/common';
import { BathroomController } from './bathroom.controller';
import { BathroomService } from './bathroom.service';
import { RatingService } from 'src/rating/rating.service';

@Module({
  controllers: [BathroomController],
  providers: [BathroomService, RatingService],
})
export class BathroomModule {}

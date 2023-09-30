import { Module } from '@nestjs/common';
import { BathroomController } from './bathroom.controller';
import { BathroomService } from './bathroom.service';
import { RatingService } from '../rating/rating.service';
import { RtGuard } from 'src/common/guards';
@Module({
  controllers: [BathroomController],
  providers: [BathroomService, RatingService, RtGuard],
})
export class BathroomModule { }

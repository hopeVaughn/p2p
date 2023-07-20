import { Module } from '@nestjs/common';
import { BathroomController } from './bathroom.controller';
import { BathroomService } from './bathroom.service';
import { RatingService } from '../rating/rating.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
@Module({
  controllers: [BathroomController],
  providers: [BathroomService, RatingService, JwtAuthGuard],
})
export class BathroomModule {}

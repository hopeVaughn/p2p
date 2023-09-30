import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { RtGuard } from '../common/guards';
@Module({
  controllers: [RatingController],
  providers: [RatingService, RtGuard],
})
export class RatingModule { }

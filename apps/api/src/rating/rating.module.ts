import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
@Module({
  controllers: [RatingController],
  providers: [RatingService, JwtAuthGuard],
})
export class RatingModule {}

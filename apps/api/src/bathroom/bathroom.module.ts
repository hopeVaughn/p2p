import { Module } from '@nestjs/common';
import { BathroomController } from './bathroom.controller';
import { BathroomService } from './bathroom.service';
import { AuthModule } from 'src/auth/auth.module';
import { RatingService } from 'src/rating/rating.service';
@Module({
  imports: [AuthModule],
  controllers: [BathroomController],
  providers: [BathroomService, RatingService],
})
export class BathroomModule { }

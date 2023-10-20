import { Module } from '@nestjs/common';
import { BathroomController } from './bathroom.controller';
import { BathroomService } from './bathroom.service';
import { RatingService } from '../rating/rating.service';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [AuthModule, RatingService],
  controllers: [BathroomController],
  providers: [BathroomService],
})
export class BathroomModule { }

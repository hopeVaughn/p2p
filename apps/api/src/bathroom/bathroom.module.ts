import { Module } from '@nestjs/common';
import { BathroomController } from './bathroom.controller';
import { BathroomService } from './bathroom.service';
import { RatingService } from '../rating/rating.service';
import { AtStrategy, RtStrategy } from '../auth/strategies';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [JwtModule.register({})],
  controllers: [BathroomController],
  providers: [BathroomService, RatingService, RtStrategy, AtStrategy],
})
export class BathroomModule { }

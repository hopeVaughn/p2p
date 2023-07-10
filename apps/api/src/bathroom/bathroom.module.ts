import { Module } from '@nestjs/common';
import { BathroomController } from './bathroom.controller';
import { BathroomService } from './bathroom.service';

@Module({
  controllers: [BathroomController],
  providers: [BathroomService],
})
export class BathroomModule {}

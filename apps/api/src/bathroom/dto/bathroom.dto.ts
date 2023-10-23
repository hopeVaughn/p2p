import {
  IsNotEmpty,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsString,
} from 'class-validator';
import { BathroomGender, StallType } from '@prisma/client';

export class CreateBathroomDto {
  @IsNotEmpty()
  @IsUUID()
  createdBy: string;

  @IsNotEmpty()
  @IsEnum(BathroomGender)
  gender: BathroomGender;

  @IsNotEmpty()
  @IsEnum(StallType)
  stallType: StallType;

  @IsNotEmpty()
  @IsBoolean()
  wheelchairAccessible: boolean;

  @IsNotEmpty()
  @IsNumber()
  stars: number;

  @IsNotEmpty()
  @IsBoolean()
  keyRequirement: boolean;

  @IsNotEmpty()
  @IsString()
  hoursOfOperation: string;

  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lng: number;

  @IsNotEmpty()
  @IsString()
  address: string;
}

export class UpdateBathroomDto {
  @IsEnum(BathroomGender)
  gender?: BathroomGender;

  @IsEnum(StallType)
  stallType?: StallType;

  @IsBoolean()
  wheelchairAccessible?: boolean;

  @IsNumber()
  cleanliness?: number;

  @IsBoolean()
  keyRequirement?: boolean;

  @IsString()
  hoursOfOperation?: string;

  @IsNumber()
  lat?: number;

  @IsNumber()
  lng?: number;

  @IsString()
  address?: string;
}


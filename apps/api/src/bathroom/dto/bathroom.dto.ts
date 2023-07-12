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
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

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
  latitude?: number;

  @IsNumber()
  longitude?: number;

  @IsString()
  address?: string;
}

export class DeleteBathroomDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsUUID()
  deletedBy: string;
}

export class VerifyBathroomDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

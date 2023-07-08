import { IsNotEmpty, IsUUID, IsInt, Min, Max } from 'class-validator';

// The CreateRatingDto class is used when creating a new Rating. It validates that the bathroomId and ratedById properties are not empty and are valid UUIDs, and that the stars property is an integer between 0 and 5 (inclusive).
export class CreateRatingDto {
  @IsNotEmpty()
  @IsUUID()
  bathroomId: string;

  @IsNotEmpty()
  @IsUUID()
  ratedById: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  stars: number;
}

// The UpdateRatingDto class is used when updating an existing Rating. It validates that if the bathroomId and ratedById properties are provided, they must be valid UUIDs, and if the stars property is provided, it must be an integer between 0 and 5 (inclusive). All properties are optional as they might not be updated in a PATCH request.
export class UpdateRatingDto {
  @IsUUID()
  bathroomId?: string;

  @IsUUID()
  ratedById?: string;

  @IsInt()
  @Min(0)
  @Max(5)
  stars?: number;
}

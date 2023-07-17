import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

// The CreateReportDto class is used when creating a new Report. It validates that the bathroomId and reportedById properties are not empty and are valid UUIDs, and that the reason property is not empty.
export class CreateReportDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  bathroomId: string;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  reportedById: string;

  @IsNotEmpty()
  @IsString()
  reason: string;
}

// The UpdateReportDto class is used when updating an existing Report. It validates that if the bathroomId and reportedById properties are provided, they must be valid UUIDs. The reason property is optional as it might not be updated in a PATCH request.
export class UpdateReportDto {
  @IsUUID()
  bathroomId?: string;

  @IsUUID()
  reportedById?: string;

  @IsString()
  reason?: string;
}

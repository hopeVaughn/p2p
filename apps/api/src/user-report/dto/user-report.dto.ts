// This DTO validates that the id, userId, and reportId fields are not empty.
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserReportDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly reportId: string;
}

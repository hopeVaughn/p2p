import { IsNotEmpty } from 'class-validator';

// This DTO validates that the id, userId, and reportId fields are not empty.
export class UserReportDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  reportId: string;
}

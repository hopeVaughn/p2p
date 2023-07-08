import { IsNotEmpty } from 'class-validator';

// This DTO validates that the id, roleId, and userId fields are not empty.
export class UserRoleDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  roleId: string;

  @IsNotEmpty()
  userId: string;
}

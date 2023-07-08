import { IsNotEmpty, IsEnum } from 'class-validator';
import { RoleName } from '@prisma/client';

// This DTO validates that the id field is not empty and name field is one of the values from the RoleName enum.
export class RoleDto {
  @IsNotEmpty()
  id: string;

  @IsEnum(RoleName)
  name: RoleName;
}

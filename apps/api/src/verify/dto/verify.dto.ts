import { IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyDto {
  @IsNotEmpty()
  @IsUUID()
  verifiedById: string;

  @IsNotEmpty()
  @IsUUID()
  bathroomId: string;
}

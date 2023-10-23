import { IsNotEmpty, IsUUID } from "class-validator";

// The VerifyDto class is used when creating a new Verify. It validates that the bathroomId and verifiedById properties are not empty and are valid UUIDs.

export class VerifyDto {
  @IsNotEmpty()
  @IsUUID()
  bathroomId: string;
}
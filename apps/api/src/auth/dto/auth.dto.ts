import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data transfer object for authentication.
 */
export class AuthDto {
  /**
   * Email of the user.
   */
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  /**
   * Password of the user.
   */
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

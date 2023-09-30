import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty() // adds form validation on the backend "ILLEGAL"
  @IsString()
  password: string;

}

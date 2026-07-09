import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginPasswordModel {
  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

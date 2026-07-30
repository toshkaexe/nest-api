import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class UserCreateModel {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

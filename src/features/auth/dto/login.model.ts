import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class LoginModel {
  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class LoginPasswordEmailModel {
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

export class EmailModel {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class RegistrationConfirmationCodeModel {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class NewPasswordModel {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  recoveryCode: string;
}

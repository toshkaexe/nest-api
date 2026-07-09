import { IsString } from 'class-validator';

export class LoginPasswordModel {
  @IsString()
  loginOrEmail: string;
  @IsString()
  password: string;
}

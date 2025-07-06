import {IsString, Matches, MaxLength, MinLength} from "class-validator";
import {IsEmail} from "class-validator";

export class LoginOrEmailModel {
    @IsString()
    @MaxLength(30)
    loginOrEmail: string;

    @IsString()
    password: string;
}


export class EmailModel {
    @IsEmail({}, {message: 'Email must be a valid email address'})
    email: string;
}


export class RecoveryPasswordModel {
    @IsString()
    @MaxLength(20)
    newPassword: string;
    @IsString()
    recoveryCode: string;
}

export class NewPasswordModel {
    @IsString()
    @MinLength(6, { message: 'newPassword must be at least 6 characters long' })
    @MaxLength(20, { message: 'newPassword must be at most 20 characters long' })
    newPassword: string;

    @IsString()
    recoveryCode: string;
}

export class RegistrationModel {
    @IsString()
    @MaxLength(30, { message: 'login must be at most 30 characters long' })
    login: string;

    @IsString()
    @MinLength(6, { message: 'password must be at least 6 characters long' })
    @MaxLength(20, { message: 'password must be at most 20 characters long' })
    password: string;

    @IsEmail({}, { message: 'email must be a valid email address' })
    email: string;
}
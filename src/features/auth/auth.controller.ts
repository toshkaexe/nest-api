import {
    Body,
    Controller,
    Get,
    HttpCode,
    Injectable, NotFoundException,
    Param,
    Post,
    UseInterceptors,
    ValidationPipe
} from '@nestjs/common';

import {ApiTags} from "@nestjs/swagger";
import {LoggingInterceptor} from "../../common/interceptors/logging.interceptor";
import {AuthService} from "./auth.service";
import {CreateNewPost} from "../posts/models/input/create-new-post.model";
import {EmailModel, LoginOrEmailModel, NewPasswordModel, RegistrationModel} from "./input/create-user.model";
import {Posts} from "../posts/models/domain/posts.entity";


@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @HttpCode(201)
    @Post('/login') // login user in the system
    login(
        @Body(new ValidationPipe({transform: true})) loginOrEmailModel: LoginOrEmailModel,
    ) {
        return this.authService.login(loginOrEmailModel);
    }

    @HttpCode(201)
    @Post('/password-recovery')
    passwordRecovery(
        @Body(new ValidationPipe({transform: true})) email: EmailModel,
    ) {
        return this.authService.recoveryPasswordByEmail(email);
    }

    @HttpCode(201)
    @Post('/new-password')
    newPassword(
        @Body(new ValidationPipe({transform: true})) newPasswordModel: NewPasswordModel,
    ) {
        return this.authService.sendNewPassword(newPasswordModel);
    }


    @HttpCode(201)
    @Post('/registration-confirmation')
    registrationConfirmation(
        @Body(new ValidationPipe({transform: true})) code: string,
    ) {
        return this.authService.registrationConfirmation(code);
    }

    @HttpCode(201)
    @Post('/registration')
    registration(
        @Body(new ValidationPipe({transform: true})) registrationModel: RegistrationModel,
    ) {
        return this.authService.registration(registrationModel);
    }

    @HttpCode(201)
    @Post('/registration-email-resending')
    registrationEmailResending(
        @Body(new ValidationPipe({transform: true})) email: EmailModel,
    ) {
        return this.authService.registrationEmailResending(email);
    }

}

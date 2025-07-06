import {Injectable, NotFoundException} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import {CreateNewPost} from "../posts/models/input/create-new-post.model";
import {Posts} from "../posts/models/domain/posts.entity";
import {EmailModel, LoginOrEmailModel, NewPasswordModel, RegistrationModel} from "./input/create-user.model";

import {UsersRepository} from "../users/infrastucture/users.repository";
import {UsersService} from "../users/application/user.service";
import {JwtService} from "../jwt/JwtService";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly userRepository: UsersRepository,
        private readonly jwtService: JwtService
    ) {
    }

    async generatePasswordHash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }

    async login(dto: LoginOrEmailModel) {
        // Найти пользователя по логину или email
        const user = await this.usersService.checkCredentials(dto);
        console.log("user in auth service = ", user)

        if (user) {
            const token = await this.jwtService.createJWT(user)

       //     res.status(StatusCode.OK_200).send({accessToken: token})
            console.log("token = ", token)
        } else {
          //  res.sendStatus(StatusCode.NOT_AUTHORIZED_401)
        }
      }


    async recoveryPasswordByEmail(dto: EmailModel) {
        // Implement password recovery logic
    }

    async sendNewPassword(dto: NewPasswordModel) {
        // Implement new password saving logic
    }

    async registration(dto: RegistrationModel) {
        // Implement registration logic
        const token = await this.jwtService.generatePasswordHash(dto.password)
        console.log("token in registration = ", token)
        return token
    }

    async registrationConfirmation(code: string) {
        // Implement confirmation logic
    }

    async registrationEmailResending(dto: EmailModel) {
        // Implement resend email logic
    }


    async comparePasswords(password: string, passwordHash: string): Promise<boolean> {
        return await bcrypt.compare(password, passwordHash);
    }







}

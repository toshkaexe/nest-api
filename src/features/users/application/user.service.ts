import {Injectable} from '@nestjs/common';
import {AuthService} from '../../auth/auth.service';
import {UsersRepository} from '../infrastucture/users.repository';
import {LoginOrEmailModel} from "../../auth/input/create-user.model";
import bcrypt from "bcrypt";
import {JwtService} from "../../jwt/JwtService";
// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) {
    }

    async create(login: string, password: string, email: string): Promise<string> {
        const generatedPasswordHash =
            await this.jwtService.generatePasswordHash(password);

        const newUser = {
            login: login,
            password: generatedPasswordHash,
            email: email,
            wwww: "www.ya.ru",
            createdAt: new Date(),
        };

        const createdUserId: string = await this.usersRepository.create(newUser);

        return createdUserId;
    }

    async removeById(id: string): Promise<boolean> {
        let b = await this.usersRepository.delete(id);
        console.log(b)
        return b;
    }

    async deleteAll(): Promise<boolean> {
        const result= await this.usersRepository.deleteAll();
        console.log(result)
         return result;
    }

    async checkCredentials(body: LoginOrEmailModel) {
        const user = await this.usersRepository.findByLoginOrEmail(body.loginOrEmail)
        if (!user) return null
        const compare = await bcrypt.compare(body.password, user.password)
        if (compare) {
            return user
        }
        return null
    }

}

import {Injectable} from '@nestjs/common';
import {AuthService} from '../../auth/auth.service';
import {UsersRepository} from '../infrastucture/users.repository';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly authService: AuthService,
    ) {
    }

    async create(login: string, password: string, email: string): Promise<string> {
        const generatedPasswordHash =
            await this.authService.generatePasswordHash(password);

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
}

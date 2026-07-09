import {Injectable, UnauthorizedException} from '@nestjs/common';

import * as bcrypt from "bcryptjs";
import {JwtService} from '@nestjs/jwt';
import {UsersQueryRepository} from '../users/infrastucture/users.query-repository';
import {UsersRepository} from '../users/infrastucture/users.repository';
import {AppSettings} from '../../settings/appSettings';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersQueryRepository: UsersQueryRepository,
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) {
    }

    async generatePasswordHash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }

    async  login(loginOrEmail: string, password: string): Promise<{ accessToken: string }> {
        console.log('=== Login attempt ===');
        console.log('loginOrEmail:', loginOrEmail);

        const user = await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
        console.log('User found:', user ? 'YES' : 'NO');

        if (!user) {
            console.log('User not found');
            throw new UnauthorizedException('Invalid credentials');
        }

        // Валидация пароля
        console.log('Comparing passwords...');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password');
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { userId: user._id || user.id, login: user.login };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }
}

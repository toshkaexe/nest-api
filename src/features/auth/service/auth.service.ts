import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UsersQueryRepository } from '../../users/repository/users.query-repository';
import { UsersRepository } from '../../users/repository/users.repository';
import { EmailService } from '../../adapter/EmailService';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async generatePasswordHash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async login(
    loginOrEmail: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    console.log('=== Login attempt ===');
    console.log('loginOrEmail:', loginOrEmail);

    const user =
      await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
    console.log('User found:', user ? 'YES' : 'NO');

    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Проверяем пароль
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

  async registration(
    login: string,
    email: string,
    password: string,
  ): Promise<void> {
    console.log('=== Registration attempt ===');
    console.log('login:', login, 'email:', email);

    // Проверяем, существует ли пользователь с таким login
    const existingUserByLogin =
      await this.usersQueryRepository.findByLoginOrEmail(login);
    if (existingUserByLogin) {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'User with this login already exists', field: 'login' },
        ],
      });
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUserByEmail =
      await this.usersQueryRepository.findByLoginOrEmail(email);
    if (existingUserByEmail) {
      throw new BadRequestException({
        errorsMessages: [
          { message: 'User with this email already exists', field: 'email' },
        ],
      });
    }

    // Создаем нового пользователя
    const hashedPassword = await this.generatePasswordHash(password);
    const newUser = {
      login,
      password: hashedPassword,
      email,
      createdAt: new Date(),
    };

    await this.usersRepository.create(newUser);
    console.log('User registered successfully');

    // TODO: Send confirmation email
  }

  async getMe(
    userId: string,
  ): Promise<{ email: string; login: string; userId: string }> {
    console.log('=== Get current user ===');
    console.log('userId:', userId);

    const user = await this.usersQueryRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      email: user.email,
      login: user.login,
      userId: user.id,
    };
  }

  async passwordRecovery(email: string): Promise<void> {
    const user = await this.usersQueryRepository.findByLoginOrEmail(email);

    if (!user) {
      return;
    }

    const recoveryCode = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.usersRepository.updateRecoveryCode(
      user._id.toString(),
      recoveryCode,
      expiresAt,
    );
    await this.emailService.sendRecoveryCode(email, recoveryCode);
  }

  async confirmNewPassword(
    newPassword: string,
    recoveryCode: string,
  ): Promise<void> {
    const user = await this.usersRepository.findByRecoveryCode(recoveryCode);

    if (!user) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Recovery code is incorrect or expired',
            field: 'recoveryCode',
          },
        ],
      });
    }

    if (user.recoveryCodeExpiresAt && user.recoveryCodeExpiresAt < new Date()) {
      throw new BadRequestException({
        errorsMessages: [
          {
            message: 'Recovery code is incorrect or expired',
            field: 'recoveryCode',
          },
        ],
      });
    }

    const passwordHash = await this.generatePasswordHash(newPassword);
    await this.usersRepository.updatePassword(
      user._id.toString(),
      passwordHash,
    );
  }
}

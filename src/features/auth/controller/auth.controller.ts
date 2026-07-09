import { Body, Controller, HttpCode, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginModel, LoginPasswordEmailModel } from '../models/LoginModel';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(
    @Body(new ValidationPipe({ transform: true }))
    loginPasswordDTO: LoginModel,
  ) {
    const { loginOrEmail, password } = loginPasswordDTO;
    return await this.authService.login(loginOrEmail, password);
  }

  @HttpCode(204)
  @Post('registration')
  async registration(
    @Body(new ValidationPipe({ transform: true }))
    loginPasswordEmailDTO: LoginPasswordEmailModel,
  ) {
    const { login, email, password } = loginPasswordEmailDTO;
    await this.authService.registration(login, email, password);
  }
}

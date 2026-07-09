import { Body, Controller, HttpCode, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginPasswordModel } from '../models/LoginPasswordModel';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(
    @Body(new ValidationPipe({ transform: true }))
    loginPasswordDTO: LoginPasswordModel,
  ) {
    const { loginOrEmail, password } = loginPasswordDTO;
    return await this.authService.login(loginOrEmail, password);
  }
}

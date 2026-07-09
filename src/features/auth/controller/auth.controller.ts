import { Body, Controller, Get, HttpCode, Post, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginModel, LoginPasswordEmailModel } from '../models/LoginModel';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

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

  @HttpCode(200)
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req: any) {
    const userId = req.user.userId;
    return await this.authService.getMe(userId);
  }
}

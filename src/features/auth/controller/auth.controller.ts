import { Body, Controller, Get, HttpCode, Post, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import {
  EmailModel,
  LoginModel,
  LoginPasswordEmailModel,
} from '../dto/login.model';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { EmailService } from '../../adapter/EmailService';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

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

  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResendong(
    @Body(new ValidationPipe({ transform: true }))
    email: EmailModel,
  ) {
    await this.emailService.send(email);
  }
}

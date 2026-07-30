import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from '../service/auth.service';
import {
  EmailModel,
  LoginModel,
  LoginPasswordEmailModel,
  NewPasswordModel,
  RegistrationConfirmationCodeModel,
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

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmation(
    @Body(new ValidationPipe({ transform: true }))
    body: RegistrationConfirmationCodeModel,
  ) {
    await this.authService.confirmRegistration(body.code);
  }

  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResendong(
    @Body(new ValidationPipe({ transform: true }))
    email: EmailModel,
  ) {
    await this.emailService.send(email);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(
    @Body(new ValidationPipe({ transform: true }))
    body: EmailModel,
  ) {
    await this.authService.passwordRecovery(body.email);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 10000 } })
  @HttpCode(204)
  @Post('new-password')
  async newPassword(
    @Body(new ValidationPipe({ transform: true }))
    body: NewPasswordModel,
  ) {
    await this.authService.confirmNewPassword(
      body.newPassword,
      body.recoveryCode,
    );
  }
}

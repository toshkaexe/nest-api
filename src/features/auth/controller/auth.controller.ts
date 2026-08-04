import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from '../service/auth.service';
import {
  EmailModel,
  LoginModel,
  LoginPasswordEmailModel,
  NewPasswordModel,
  RegistrationConfirmationCodeModel,
} from '../dto/login.model';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard)
  @HttpCode(200)
  @Post('login')
  async login(
    @Body(new ValidationPipe({ transform: true }))
    loginPasswordDTO: LoginModel,
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { loginOrEmail, password } = loginPasswordDTO;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    const result = await this.authService.login(
      loginOrEmail,
      password,
      ip,
      userAgent,
    );

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: result.accessToken };
  }

  @UseGuards(ThrottlerGuard)
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
  @HttpCode(204)
  @Post('registration-confirmation')
  async registrationConfirmation(
    @Body(new ValidationPipe({ transform: true }))
    body: RegistrationConfirmationCodeModel,
  ) {
    await this.authService.confirmRegistration(body.code);
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  @Post('registration-email-resending')
  async registrationEmailResending(
    @Body(new ValidationPipe({ transform: true }))
    body: EmailModel,
  ) {
    await this.authService.resendConfirmationEmail(body.email);
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  @Post('password-recovery')
  async passwordRecovery(
    @Body(new ValidationPipe({ transform: true }))
    body: EmailModel,
  ) {
    await this.authService.passwordRecovery(body.email);
  }

  @UseGuards(ThrottlerGuard)
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

  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = req.cookies?.refreshToken;
    const result = await this.authService.refreshTokens(token);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken: result.accessToken };
  }

  @HttpCode(204)
  @Post('logout')
  async logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.refreshToken;
    await this.authService.logout(token);
    res.clearCookie('refreshToken');
  }
}

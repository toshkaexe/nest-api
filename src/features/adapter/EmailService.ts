import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AppSettings } from '../../settings/appSettings';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 465,
      secure: true,
      auth: {
        user: AppSettings.SEND_MAIL_SERVICE_EMAIL,
        pass: AppSettings.EMAIL_PWS,
      },
    });
  }

  async sendRecoveryCode(email: string, recoveryCode: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"Blogger API" <${AppSettings.SEND_MAIL_SERVICE_EMAIL}>`,
      to: email,
      subject: 'Password Recovery',
      html: `
                <h1>Password Recovery</h1>
                <p>Your recovery code: <strong>${recoveryCode}</strong></p>
                <p>This code will expire in 1 hour.</p>
            `,
    });
  }

  async sendRegistrationConfirmationLink(
    email: string,
    confirmationCode: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: `"Blogger API" <${AppSettings.SEND_MAIL_SERVICE_EMAIL}>`,
      to: email,
      subject: 'Registration Confirmation',
      html: `
                <h1>Registration Confirmation</h1>
                <p>To confirm your registration, please click the link below:</p>
                <a href="https://some-front.com/confirm-registration?code=${confirmationCode}">Confirm Registration</a>
                <p>This code will expire in 1 hour.</p>
            `,
    });
  }

  async send(email: { email: string }): Promise<void> {
    await this.transporter.sendMail({
      from: `"Blogger API" <${AppSettings.SEND_MAIL_SERVICE_EMAIL}>`,
      to: email.email,
      subject: 'Email Confirmation',
      html: `<h1>Email Confirmation</h1><p>Please confirm your email.</p>`,
    });
  }
}

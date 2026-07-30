import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AppSettings } from '../../settings/appSettings';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
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

    async send(email: { email: string }): Promise<void> {
        await this.transporter.sendMail({
            from: `"Blogger API" <${AppSettings.SEND_MAIL_SERVICE_EMAIL}>`,
            to: email.email,
            subject: 'Email Confirmation',
            html: `<h1>Email Confirmation</h1><p>Please confirm your email.</p>`,
        });
    }
}

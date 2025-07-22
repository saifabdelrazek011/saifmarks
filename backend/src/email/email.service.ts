import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { verifyEmail } from '../../template/verify-email';
import { resetPasswordEmail } from '../../template/reset-password-email';
import { FRONTEND_URL } from '../../config/env';

const frontendUrl = FRONTEND_URL || 'https://marks.saifdev.org';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail({
    to,
    token,
    subject,
  }: {
    to: string;
    token: string;
    subject: string;
  }): Promise<void> {
    try {
      const html = verifyEmail(token, frontendUrl);

      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  async sendResetPasswordCodeEmail({
    to,
    code,
  }: {
    to: string;
    code: string | number;
  }) {
    try {
      const html = resetPasswordEmail(code, frontendUrl);

      await this.mailerService.sendMail({
        to,
        subject: `Reset Password Code`,
        html,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail({
    to,
    subject,
    template,
    token,
  }: {
    to: string;
    subject: string;
    template: string;
    token: string;
  }): Promise<void> {
    try {
      const frontendUrl = process.env.FRONTEND_URL;
      console.log(
        `Sending verification email to ${to} with token ${token} and frontend URL ${frontendUrl}`,
      );

      await this.mailerService.sendMail({
        to,
        subject,
        html: `
          <p>Click the button below to verify your email:</p>
          <a href="${frontendUrl}/verify-email?token=${token}" class="verify-button">
            Verify My Email
          </a>
          <p>Or copy and paste the following link into your browser:</p>
          <a href="${frontendUrl}/verify-email?token=${token}">
            ${frontendUrl}/verify-email?token=${token}
          </a>
        `,
      });
    } catch (error) {
      console.error(`Failed to send verification email to ${to}:`, error);
      throw new Error('Failed to send verification email');
    }
  }
}

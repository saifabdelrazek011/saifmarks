import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { verifyEmail } from '../../template/verify-email';
import { resetPasswordEmail } from '../../template/reset-password-email';
import { FRONTEND_URL } from '../../config/env';
import { contactFormToAdmin, contactFormToSender } from 'template/contact-form';
import { ADMIN_EMAIL } from '../../config/env';

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
    const html = verifyEmail(token, frontendUrl);

    await this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }

  async sendResetPasswordCodeEmail({
    to,
    code,
  }: {
    to: string;
    code: string | number;
  }) {
    const html = resetPasswordEmail(code, frontendUrl);

    await this.mailerService.sendMail({
      to,
      subject: `Reset Password Code`,
      html,
    });
  }

  async sendContactEmail({
    senderEmail,
    name,
    subject,
    message,
  }: {
    subject: string;
    name: string;
    senderEmail: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      if (!senderEmail || !subject || !message) {
        throw new BadRequestException(
          'Missing required fields: senderEmail, subject, or message',
        );
      }

      if (message.length < 50) {
        throw new BadRequestException(
          'Message must be at least 50 characters long',
        );
      }

      const htmlToAdmin = contactFormToAdmin({
        name,
        email: senderEmail,
        message,
      });

      if (!htmlToAdmin) {
        throw new BadRequestException('Failed to create email content');
      }

      const adminEmail = ADMIN_EMAIL || 'contact@saifdev.org';

      if (!adminEmail) {
        throw new Error('Admin email is not configured');
      }

      await this.mailerService.sendMail({
        to: adminEmail,
        subject,
        html: htmlToAdmin,
        replyTo: senderEmail,
      });

      const htmlToSender = contactFormToSender({ name, message, subject });

      await this.mailerService.sendMail({
        to: senderEmail,
        subject: `Copy of your message to ${adminEmail}`,
        html: htmlToSender,
        replyTo: adminEmail,
      });
      return {
        success: true,
        message: 'Contact email sent successfully',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }
}

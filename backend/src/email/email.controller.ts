import { BadRequestException, Controller } from '@nestjs/common';
import { EmailService } from './email.service';
import { Post, Body } from '@nestjs/common';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  // Define your email-related endpoints here

  @Post('contact')
  async sendContactEmail(
    @Body('senderEmail') senderEmail: string,
    @Body('name') name: string,
    @Body('subject') subject: string,
    @Body('message') message: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!senderEmail || !name || !subject || !message) {
      throw new BadRequestException('Invalid contact information');
    }

    return await this.emailService.sendContactEmail({
      senderEmail,
      name,
      subject,
      message,
    });
  }
}

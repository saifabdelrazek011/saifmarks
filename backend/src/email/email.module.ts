import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import mailerConfig from './mailer.config';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [MailerModule.forRoot(mailerConfig)],
  exports: [EmailService],
})
export class EmailModule {}

import { MailerOptions } from '@nestjs-modules/mailer';
import {
  NODE_ENV,
  SEND_EMAIL_ADDRESS,
  SEND_EMAIL_PASSWORD,
  SEND_EMAIL_SMTP_HOST,
} from 'config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export const mailerConfig: MailerOptions = {
  transport: {
    host: SEND_EMAIL_SMTP_HOST,
    port: 587,
    auth: {
      user: SEND_EMAIL_ADDRESS,
      pass: SEND_EMAIL_PASSWORD,
    },
  },
  defaults: {
    from: `"No Reply | SaifDEV" <${SEND_EMAIL_ADDRESS}>`,
  },
  preview: NODE_ENV === 'development',
  template: {
    dir: process.cwd() + '/template/',
    adapter: new EjsAdapter({
      inlineCssEnabled: true,
    }),
    options: {
      cache: false,
      strict: true,
    },
  },
};

export default mailerConfig;

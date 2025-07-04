import { config } from 'dotenv';

config();

export const {
  PORT,
  JWT_SECRET,
  JWT_EXPIRATION,
  REDIS_URL,
  REDIS_TTL,
  LOG_LEVEL,
  CORS_ORIGIN,
  NODE_ENV,
  SEND_EMAIL_ADDRESS,
  SEND_EMAIL_PASSWORD,
  SEND_EMAIL_SMTP_HOST,
  FRONTEND_URL,
} = process.env;

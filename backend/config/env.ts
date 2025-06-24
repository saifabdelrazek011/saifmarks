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
} = process.env;

import { config } from 'dotenv';

config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

export const {
  PORT,
  JWT_SECRET,
  JWT_EXPIRATION,
  REDIS_URL,
  REDIS_TTL,
  LOG_LEVEL,
  CORS_ORIGIN,
} = process.env;

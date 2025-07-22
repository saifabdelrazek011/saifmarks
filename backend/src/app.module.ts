import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { APP_GUARD } from '@nestjs/core';
import { ARCJET_KEY } from '../config';

// Arcjet
import {
  ArcjetGuard,
  ArcjetModule,
  detectBot,
  fixedWindow,
  shield,
} from '@arcjet/nest';
import { ShortUrlModule } from './shorturl/shorturl.module';
@Module({
  imports: [
    // Load ConfigModule FIRST
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ArcjetModule.forRoot({
      isGlobal: true,

      key: ARCJET_KEY ? ARCJET_KEY : '',

      rules: [
        // Shield protects your app from common attacks e.g. SQL injection

        shield({ mode: 'LIVE' }),

        // Create a bot detection rule

        detectBot({
          mode: 'LIVE', // Blocks requests. Use "DRY_RUN" to log only

          // Block all bots except the following

          allow: [
            'CATEGORY:SEARCH_ENGINE', // Google, Bing, etc

            // Uncomment to allow these other common bot categories

            // See the full list at https://arcjet.com/bot-list

            //"CATEGORY:MONITOR", // Uptime monitoring services

            //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
          ],
        }),

        // Create a fixed window rate limit. Other algorithms are supported.

        fixedWindow({
          mode: 'LIVE',

          window: '60s', // 10 second fixed window

          max: 20, // Allow a maximum of 20 requests
        }),
      ],
    }),

    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    EmailModule,
    ShortUrlModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ArcjetGuard,
    },
  ],
})
export class AppModule {}

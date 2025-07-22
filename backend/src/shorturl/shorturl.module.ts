import { Module } from '@nestjs/common';
import { ShortUrlController } from './shorturl.controller';
import { ShortUrlService } from './shorturl.service';

@Module({
  controllers: [ShortUrlController],
  providers: [ShortUrlService],
  exports: [ShortUrlService],
})
export class ShortUrlModule {}

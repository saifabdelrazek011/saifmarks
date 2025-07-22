import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { ShortUrlModule } from '../shorturl/shorturl.module';

@Module({
  controllers: [BookmarkController],
  imports: [ShortUrlModule],
  providers: [BookmarkService],
})
export class BookmarkModule {}

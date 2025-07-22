import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { ShortUrlService } from '../shorturl/shorturl.service';
import { GetUser } from '../auth/decorator';
import { UpdateBookmarkDto, CreateBookmarkDto } from './dto';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService,
    private shortUrlService: ShortUrlService,
  ) {}

  @Get()
  async getBookmarks(@GetUser('id') userId: string) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  async getBookmarkById(
    @GetUser('id') userId: string,
    @Param('id') bookmarkId: string,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Get('mine/:userBookmarkId')
  async getBookmarkByUserId(
    @Param('userId') @GetUser('id') userId: string,
    @Param('userBookmarkId', ParseIntPipe) userBookmarkId: number,
  ) {
    return this.bookmarkService.getBookmarkForUserById(userId, userBookmarkId);
  }

  @Post()
  async createBookmark(
    @GetUser('id') userId: string,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Patch(':bookmarkId')
  async updateBookmark(
    @GetUser('id') userId: string,
    @Param('bookmarkId') bookmarkId: string,
    @Body() dto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmark(userId, bookmarkId, dto);
  }

  @Delete(':bookmarkId')
  async deleteBookmark(
    @GetUser('id') userId: string,
    @Param('bookmarkId') bookmarkId: string,
  ) {
    return this.bookmarkService.deleteBookmark(userId, bookmarkId);
  }

  @Post(':bookmarkId/shorten')
  async createShortUrlForBookmark(
    @GetUser('id') userId: string,
    @Body('shortUrl') shortUrl: string | undefined,
    @Param('bookmarkId') bookmarkId: string,
  ) {
    return this.shortUrlService.createShortUrlForBookmark(
      userId,
      bookmarkId,
      shortUrl,
    );
  }
}

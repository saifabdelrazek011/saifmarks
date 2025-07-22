import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ShortUrlService } from './shorturl.service';
import { Response } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@Controller('shorturl')
export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  // Check if a short URL exists for a user (requires authentication)
  @UseGuards(JwtGuard)
  @Get('check/:id')
  async checkShortUrlExists(
    @Param('id') shortUrlId: string,
    @Query('userId') userId: string,
  ) {
    return this.shortUrlService.checkShortUrlExists(shortUrlId, userId);
  }

  // Get all short URLs for a user (admin or self, requires authentication)
  @UseGuards(JwtGuard)
  @Get('user/:userId')
  async getUserShortUrls(
    @Param('userId') userId: string,
    @GetUser('id') viewerUserId: string,
  ) {
    return this.shortUrlService.getUserShortUrls(userId, viewerUserId);
  }

  // Get my short URLs (requires authentication)
  @UseGuards(JwtGuard)
  @Get('me')
  async getMyShortUrls(@GetUser('id') userId: string) {
    return this.shortUrlService.getMyShortUrls(userId);
  }

  // Get all short URLs (admin only, requires authentication)
  @UseGuards(JwtGuard)
  @Get()
  async getAllShortUrls(@GetUser('id') userId: string) {
    return this.shortUrlService.getAllShortUrls(userId);
  }

  // Get a short URL by ID (requires authentication)
  @UseGuards(JwtGuard)
  @Get(':id')
  async getShortUrlById(
    @Param('id') shortUrlId: string,
    @GetUser('id') userId: string,
  ) {
    return this.shortUrlService.getShortUrlById(shortUrlId, userId);
  }

  // Create a new short URL (requires authentication)
  @UseGuards(JwtGuard)
  @Post()
  async createShortUrl(
    @Body('fullUrl') fullUrl: string,
    @Body('shortUrl') shortUrl: string,
    @GetUser('id') userId: string,
  ) {
    return this.shortUrlService.createShortUrl(fullUrl, shortUrl, userId);
  }

  // Use a short URL (public, no authentication required)
  @Get('use/:short')
  @HttpCode(HttpStatus.FOUND)
  async useShortUrl(@Param('short') short: string, @Res() res: Response) {
    const url = await this.shortUrlService.useShortUrl(short);
    return res.redirect(url);
  }

  // Get short URL info by code (requires authentication)
  @UseGuards(JwtGuard)
  @Get('info/:short')
  async getShortUrlInfo(
    @Param('short') short: string,
    @GetUser('id') userId: string,
  ) {
    return this.shortUrlService.getShortUrlInfoByShort(short, userId);
  }

  // Update an existing short URL (requires authentication)
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateShortUrl(
    @Param('id') shortUrlId: string,
    @Body('fullUrl') fullUrl: string,
    @Body('shortUrl') shortUrl: string,
    @GetUser('id') userId: string,
  ) {
    return this.shortUrlService.updateShortUrl(
      shortUrlId,
      fullUrl,
      shortUrl,
      userId,
    );
  }

  // Delete a short URL (requires authentication)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteShortUrl(
    @Param('id') shortUrlId: string,
    @GetUser('id') userId: string,
  ) {
    return this.shortUrlService.deleteShortUrl(shortUrlId, userId);
  }
}

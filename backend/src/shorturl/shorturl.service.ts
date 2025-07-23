import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { nanoid } from 'nanoid';
import { SHORT_URL_DOMAIN } from '../../config/env';
import { urlRegex } from 'src/regex';

@Injectable()
export class ShortUrlService {
  constructor(private readonly prisma: PrismaService) {}

  // Generate a short URL
  private async generateShortUrl(shortUrl?: string): Promise<string> {
    let short = shortUrl;
    if (short) {
      // User provided a custom short URL
      const existingShort = await this.prisma.shortUrl.findUnique({
        where: { shortUrl: short },
      });
      if (existingShort) {
        throw new BadRequestException(
          'Custom short URL already exists. Please choose another or send empty string to generate a random one.',
        );
      }
    } else {
      // Auto-generate a unique short URL
      let attempts = 0;
      do {
        short = nanoid(7);
        const existingShort = await this.prisma.shortUrl.findUnique({
          where: { shortUrl: short },
        });
        if (!existingShort) break;
        attempts++;
      } while (attempts < 100);

      if (attempts === 100) {
        throw new Error(
          'Failed to generate a unique short URL after 100 attempts.',
        );
      }
    }
    return short;
  }

  // Check if a short URL exists for a user
  async checkShortUrlExists(shortUrlId: string, userId: string) {
    try {
      if (!shortUrlId)
        throw new BadRequestException('Short URL ID is required');

      if (!userId) {
        throw new NotFoundException('You are not registered.');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { emails: true },
      });

      if (!user) throw new NotFoundException('User not found.');

      const shortUrl = await this.prisma.shortUrl.findFirst({
        where: {
          id: shortUrlId,
        },
      });

      if (
        !user.isAdmin ||
        (!user.emails[0].isVerified && userId !== shortUrl?.createdById)
      ) {
        throw new ForbiddenException(
          'Forbidden: You are not allowed to check this short URL. You must be an admin or the owner of the short URL and have a verified email.',
        );
      }

      if (!shortUrl)
        throw new NotFoundException(
          'Short URL does not exist, or you do not have permission to check it.',
        );
      return { success: true, message: 'Short URL exists.' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown error in checkShortUrlExists',
      );
    }
  }

  // Get all short URLs for a user (admin or self)
  async getUserShortUrls(userId: string, viewerUserId: string) {
    try {
      if (!viewerUserId) {
        throw new NotFoundException('You are not registered.');
      }
      if (!userId) {
        throw new BadRequestException('User ID is required.');
      }

      const viewerUser = await this.prisma.user.findUnique({
        where: { id: viewerUserId },
        include: { emails: true },
      });

      if (!viewerUser) {
        throw new NotFoundException('You are not registered.');
      }

      if (!viewerUser.isAdmin && viewerUserId !== userId) {
        throw new ForbiddenException(
          "Forbidden: You are not allowed to view this user's short URLs.",
        );
      }

      const shortUrls = await this.prisma.shortUrl.findMany({
        where: { createdById: userId },
        include: { bookmark: true },
      });

      if (!shortUrls.length) {
        throw new NotFoundException('No short URLs found for this user.');
      }

      return {
        success: true,
        message: 'Short URLs fetched successfully.',
        shortUrls,
      };
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown error in getUserShortUrls',
      );
    }
  }

  // Get my short URLs
  async getMyShortUrls(userId: string) {
    try {
      if (!userId) {
        throw new NotFoundException('You are not registered.');
      }

      const shortUrls = await this.prisma.shortUrl.findMany({
        where: { createdById: userId },
        include: { bookmark: true },
      });

      // Check if the user has any short URLs 0 is falsey others are truthy
      if (!shortUrls.length) {
        return {
          success: false,
          message: 'No short URLs found for you.',
          shortUrls: [],
        };
      }

      return {
        success: true,
        message: 'Your short URLs fetched successfully.',
        shortUrls,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown error in getMyShortUrls',
      );
    }
  }

  // Get all short URLs (admin only)
  async getAllShortUrls(viewerUserId: string) {
    try {
      if (!viewerUserId) {
        throw new NotFoundException('You are not registered.');
      }

      const viewerUser = await this.prisma.user.findUnique({
        where: { id: viewerUserId },
      });

      if (!viewerUser || !viewerUser.isAdmin) {
        throw new ForbiddenException(
          'Forbidden: You are not allowed to view all short URLs.',
        );
      }

      // Fetch all short URLs
      const shortUrls = await this.prisma.shortUrl.findMany();

      if (!shortUrls.length) {
        throw new NotFoundException('No short URLs found.');
      }

      return {
        success: true,
        message: 'All short URLs fetched successfully.',
        shortUrls,
      };
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown error in getAllShortUrls',
      );
    }
  }

  // Get a short URL by ID
  async getShortUrlById(shortUrlId: string, viewerUserId: string) {
    try {
      if (!viewerUserId) {
        throw new NotFoundException('You are not registered.');
      }

      if (!shortUrlId) {
        throw new BadRequestException('Short URL ID is required.');
      }

      const viewerUser = await this.prisma.user.findUnique({
        where: { id: viewerUserId },
        include: { emails: true },
      });

      if (!viewerUser) {
        throw new NotFoundException('You are not registered.');
      }

      const shortUrl = await this.prisma.shortUrl.findUnique({
        where: { id: shortUrlId },
      });

      if (!shortUrl) throw new NotFoundException('Short URL not found.');

      if (
        viewerUser.isAdmin ||
        (viewerUser.emails[0].isVerified &&
          viewerUserId === shortUrl?.createdById)
      ) {
        // User is either an admin or the owner with a verified email
        throw new ForbiddenException(
          'Forbidden: You are not allowed to view this short URL.',
        );
      }

      return {
        success: true,
        message: 'Short URL fetched successfully.',
        shortUrl,
      };
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown error in getShortUrlById',
      );
    }
  }

  // Create a new short URL
  async createShortUrl(
    fullUrl: string,
    shortUrl: string | undefined,
    creatorId: string,
  ) {
    try {
      if (!creatorId) throw new NotFoundException('You are not registered.');
      const creator = await this.prisma.user.findUnique({
        where: { id: creatorId },
        include: { emails: true },
      });
      if (!creator) throw new NotFoundException('You are not registered.');

      if (!creator.emails[0].isVerified)
        throw new ForbiddenException(
          'You must be a verified user to create a short URL.',
        );

      if (!fullUrl) throw new BadRequestException('Full URL is required.');
      if (!urlRegex.test(fullUrl)) {
        throw new BadRequestException('Invalid URL format.');
      }

      const domain = SHORT_URL_DOMAIN || 'https://go.died.pw';

      const short = await this.generateShortUrl(shortUrl);

      if (!short) {
        throw new BadRequestException('Failed to generate a short URL.');
      }

      const existingFull = await this.prisma.shortUrl.findFirst({
        where: { fullUrl, createdById: creatorId },
      });

      if (existingFull) {
        throw new BadRequestException(
          `You have already created a short URL for this full URL: ${existingFull.shortUrl}. Please use that or delete it first.`,
        );
      }

      const createdShortUrl = await this.prisma.shortUrl.create({
        data: {
          fullUrl,
          shortUrl: short,
          createdById: creatorId,
        },
      });

      if (!createdShortUrl) {
        throw new Error('Short URL creation failed.');
      }

      return {
        success: true,
        message: 'Short URL created successfully.',
        shortUrl: `${domain}/${short}`,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown error in createShortUrl',
      );
    }
  }

  // Redirect to the full URL and increment clicks
  async useShortUrl(short: string) {
    try {
      const shortUrl = await this.prisma.shortUrl.findUnique({
        where: { shortUrl: short },
      });

      if (!shortUrl) throw new NotFoundException('Short URL not found.');

      await this.prisma.shortUrl.update({
        where: { shortUrl: short },
        data: { clicks: { increment: 1 } },
      });

      return shortUrl.fullUrl;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        error instanceof Error ? error.message : 'Unknown error in useShortUrl',
      );
    }
  }

  // Get short URL info
  async getShortUrlInfoByShort(short: string, viewerUserId: string) {
    try {
      if (!viewerUserId) {
        throw new NotFoundException('You are not registered.');
      }
      if (!short) throw new BadRequestException('Short URL is required.');

      const viewerUser = await this.prisma.user.findUnique({
        where: { id: viewerUserId },
        include: { emails: true },
      });

      if (!viewerUser) {
        throw new NotFoundException('You are not registered.');
      }

      const shortUrl = await this.prisma.shortUrl.findUnique({
        where: { shortUrl: short },
      });

      if (!shortUrl) throw new NotFoundException('Short URL not found.');

      if (
        !viewerUser.isAdmin &&
        (!viewerUser.emails[0].isVerified ||
          viewerUserId !== shortUrl?.createdById)
      ) {
        throw new ForbiddenException(
          'Forbidden: You are not allowed to view this short URL information.',
        );
      }

      return {
        success: true,
        message: 'Short URL information fetched successfully.',
        shortUrl,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown error in getShortUrlInfo',
      );
    }
  }

  // Update an existing short URL
  async updateShortUrl(
    shortUrlId: string,
    fullUrl: string,
    shortUrl: string,
    updaterUserId: string,
  ) {
    try {
      if (!updaterUserId) {
        throw new NotFoundException('You are not registered.');
      }
      if (!shortUrlId) {
        throw new BadRequestException('Short URL ID is required.');
      }
      if (!fullUrl) {
        throw new BadRequestException('Full URL is required.');
      }
      if (!urlRegex.test(fullUrl)) {
        throw new BadRequestException('Invalid URL format.');
      }
      const updaterUser = await this.prisma.user.findUnique({
        where: { id: updaterUserId },
        include: { emails: true },
      });

      if (!updaterUser) {
        throw new NotFoundException('User not found.');
      }

      const requestedUrl = await this.prisma.shortUrl.findUnique({
        where: { id: shortUrlId },
      });

      if (!requestedUrl) throw new NotFoundException('Short URL not found');

      if (
        !updaterUser.isAdmin &&
        (!updaterUser.emails[0].isVerified ||
          updaterUserId !== requestedUrl.createdById)
      ) {
        throw new ForbiddenException(
          'Forbidden: You are not allowed to update this short URL.',
        );
      }

      // Check if the new short URL already exists (excluding current one)
      if (shortUrl && shortUrl !== requestedUrl.shortUrl) {
        const existingShort = await this.prisma.shortUrl.findUnique({
          where: { shortUrl },
        });
        if (existingShort && existingShort.id !== shortUrlId) {
          throw new BadRequestException('Short URL already in use.');
        }
      }

      const updated = await this.prisma.shortUrl.update({
        where: { id: shortUrlId },
        data: { fullUrl, shortUrl: shortUrl || requestedUrl.shortUrl },
      });

      if (!updated) {
        throw new Error('Short URL update failed.');
      }

      return {
        success: true,
        message: 'Short URL updated successfully',
        shortUrl: updated,
      };
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Unknown error in updateShortUrl',
      );
    }
  }

  // Delete a short URL
  async deleteShortUrl(shortUrlId: string, deleterUserId: string) {
    try {
      if (!deleterUserId) {
        throw new NotFoundException('You are not registered.');
      }
      if (!shortUrlId) {
        throw new BadRequestException('Short URL ID is required.');
      }

      const deleterUser = await this.prisma.user.findUnique({
        where: { id: deleterUserId },
        include: { emails: true },
      });

      if (!deleterUser) {
        throw new NotFoundException('User not found.');
      }

      const requestedUrl = await this.prisma.shortUrl.findUnique({
        where: { id: shortUrlId },
      });

      if (!requestedUrl) {
        throw new NotFoundException('Short URL not found.');
      }

      if (
        !deleterUser.isAdmin &&
        (!deleterUser.emails[0].isVerified ||
          deleterUserId !== requestedUrl.createdById)
      ) {
        throw new ForbiddenException(
          'Forbidden: You are not allowed to delete this short URL.',
        );
      }

      if (!requestedUrl) {
        throw new NotFoundException(
          'Short URL not found or you do not have permission to delete it.',
        );
      }

      const deleted = await this.prisma.shortUrl.delete({
        where: { id: shortUrlId },
      });

      if (!deleted) {
        throw new Error('Short URL deletion failed.');
      }

      return { success: true, message: 'Short URL deleted successfully.' };
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof Error
      ) {
        throw error;
      }
      // Ensure a return value for all code paths
      throw new Error('Unknown error in deleteShortUrl');
    }
  }

  // Create a short URL for a bookmark
  async createShortUrlForBookmark(
    userId: string,
    bookmarkId: string,
    shortUrl: string | undefined,
  ) {
    try {
      if (!userId) throw new NotFoundException('You are not registered.');

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { emails: true },
      });

      if (!user) throw new NotFoundException('You are not registered.');

      if (!user.emails[0].isVerified)
        throw new ForbiddenException(
          'You must be a verified user to create a short URL for a bookmark.',
        );

      if (!bookmarkId)
        throw new BadRequestException('Bookmark ID is required.');
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId },
        include: { user: true, shortUrl: true },
      });

      if (!bookmark || bookmark.userId !== userId)
        throw new NotFoundException('Bookmark not found.');

      if (bookmark.shortUrl) {
        throw new BadRequestException(
          'This bookmark already has a short URL. Please delete it first if you want to create a new one.',
        );
      }

      const existingShortUrl = await this.prisma.shortUrl.findFirst({
        where: { fullUrl: bookmark.url, createdById: userId },
      });

      if (existingShortUrl) {
        const updatedShortUrl = await this.prisma.shortUrl.update({
          where: { id: existingShortUrl.id },
          data: {
            bookmarkId: bookmark.id,
          },
        });
        return {
          success: true,
          message: 'We have connected the short URL for your bookmark.',
          shortUrl: updatedShortUrl,
        };
      }

      const short = await this.generateShortUrl(shortUrl);

      if (!short) {
        throw new BadRequestException('Failed to generate a short URL.');
      }

      const createdShortUrl = await this.prisma.shortUrl.create({
        data: {
          fullUrl: bookmark.url,
          shortUrl: short,
          createdById: userId,
          bookmarkId: bookmark.id,
        },
      });

      if (!createdShortUrl) {
        throw new Error('Short URL creation for bookmark failed.');
      }

      return {
        success: true,
        message: 'Short URL for bookmark created successfully.',
        shortUrl: createdShortUrl,
      };
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof Error
      ) {
        throw error;
      }
      throw new Error('Unknown error in createForBookmark');
    }
  }
}

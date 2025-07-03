import {
  BadRequestException,
  ForbiddenException,
  Get,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(JwtGuard)
@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {
    if (!this.prisma) {
      throw new Error('PrismaService is not initialized');
    }
  }

  async getBookmarks(userId: string) {
    try {
      // Ensure PrismaService is initialized
      if (!this.prisma) {
        throw new Error('PrismaService is not initialized');
      }
      if (!userId) {
        throw new UnauthorizedException('User is not authenticated');
      }
      // Fetch bookmarks for the authenticated user
      const bookmarks = await this.prisma.bookmark.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (!bookmarks) {
        throw new NotFoundException('No bookmarks found for this user');
      }

      return {
        success: true,
        message: 'Bookmarks fetched successfully',
        bookmarks,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error; // re-throw known HTTP exceptions
      }
      throw new Error(`Error fetching bookmarks: ${error.message}`);
    }
  }

  async getBookmarkById(userId: string, bookmarkId: string) {
    try {
      // Ensure PrismaService is initialized
      if (!this.prisma) {
        throw new Error('PrismaService is not initialized');
      }
      // Validate the bookmarkId
      if (!bookmarkId) {
        throw new BadRequestException(
          'Bookmark ID is required to fetch a bookmark',
        );
      }

      // Check if the user is authenticated
      if (!userId) {
        throw new UnauthorizedException('User is not authenticated');
      }

      // Fetch the bookmark by ID for the authenticated user
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId, userId },
      });

      if (!bookmark) {
        throw new NotFoundException(
          'Bookmark not found or does not belong to the user',
        );
      }

      return {
        success: true,
        message: 'Bookmark fetched successfully',
        bookmark,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error; // re-throw known HTTP exceptions
      }
      throw new Error(`Error fetching bookmark: ${error.message}`);
    }
  }

  async getBookmarkForUserById(userId: string, userBookmarkId: number) {
    try {
      // Ensure PrismaService is initialized
      if (!this.prisma) {
        throw new Error('PrismaService is not initialized');
      }

      // Validate the userId and userBookmarkId
      if (!userId || !userBookmarkId) {
        throw new BadRequestException(
          'User ID and Bookmark ID are required to fetch a bookmark',
        );
      }

      // Fetch the bookmark for the authenticated user
      const bookmark = await this.prisma.bookmark.findFirst({
        where: { userBookmarkId, userId },
      });

      if (!bookmark) {
        throw new NotFoundException('Bookmark not found for this user');
      }

      return {
        success: true,
        message: 'Bookmark fetched successfully',
        bookmark,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error; // re-throw known HTTP exceptions
      }
      throw new Error(`Error fetching bookmark: ${error.message}`);
    }
  }

  async createBookmark(userId: string, dto: CreateBookmarkDto) {
    try {
      // Ensure PrismaService is initialized
      if (!this.prisma) {
        throw new Error('PrismaService is not initialized');
      }
      // Validate the userId
      if (!userId) {
        throw new UnauthorizedException('User is not authenticated');
      }

      // Validate the DTO
      if (!dto || !dto.title || !dto.url) {
        throw new BadRequestException(
          'Title and URL are required to create a bookmark',
        );
      }

      // Check if the URL is valid
      try {
        new URL(dto.url);
      } catch (e) {
        throw new BadRequestException('Invalid URL format');
      }

      // Ensure description is optional and defaults to an empty string if not provided
      if (!dto.description) {
        dto.description = '';
      }

      // Check if a bookmark with the same URL already exists for the user
      const existingBookmark = await this.prisma.bookmark.findFirst({
        where: {
          userId,
          url: dto.url,
        },
      });

      if (existingBookmark) {
        throw new ForbiddenException('Bookmark with this URL already exists');
      }

      // Generate the userBookmarkId
      const lastBookmark = await this.prisma.bookmark.findFirst({
        where: { userId },
        orderBy: { userBookmarkId: 'desc' },
      });
      const nextUserBookmarkId = lastBookmark
        ? lastBookmark.userBookmarkId + 1
        : 1;

      // Create the bookmark
      const bookmark = await this.prisma.bookmark.create({
        data: {
          ...dto,
          userId,
          userBookmarkId: nextUserBookmarkId,
        },
      });

      if (!bookmark) {
        throw new Error('Failed to create bookmark from here');
      }

      return {
        success: true,
        message: 'Bookmark created successfully',
        bookmark,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error; // re-throw known HTTP exceptions
      }
      throw new Error(`Error creating bookmark: ${error.message}`);
    }
  }

  async updateBookmark(
    userId: string,
    bookmarkId: string,
    dto: UpdateBookmarkDto,
  ) {
    try {
      // Ensure PrismaService is initialized
      if (!this.prisma) {
        throw new Error('PrismaService is not initialized');
      }
      // Validate the bookmarkId
      if (!bookmarkId) {
        throw new BadRequestException(
          'Bookmark ID is required to update a bookmark',
        );
      }

      // Check if the user is authenticated
      if (!userId) {
        throw new UnauthorizedException('User is not authenticated');
      }

      // Check if the URL is valid
      try {
        new URL(dto.url);
      } catch (e) {
        throw new BadRequestException('Invalid URL format');
      }

      // Ensure description is optional and defaults to an empty string if not provided
      if (!dto.description) {
        dto.description = '';
      }

      // Check if the bookmark exists and belongs to the authenticated user
      const existingBookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId, userId },
      });

      if (!existingBookmark) {
        throw new NotFoundException(
          'Bookmark not found or does not belong to the user',
        );
      }

      // Set unsent fields
      dto.description
        ? (dto.description = dto.description)
        : (dto.description = '');
      dto.title
        ? (dto.title = dto.title)
        : (dto.title = existingBookmark.title);
      dto.url ? (dto.url = dto.url) : (dto.url = existingBookmark.url);

      // Check that any of the fields are updated
      if (
        dto.title === existingBookmark.title &&
        dto.description === existingBookmark.description &&
        dto.url === existingBookmark.url
      ) {
        throw new BadRequestException(
          'You should change one of the fields before updating',
        );
      }

      // Create the bookmark
      const bookmark = await this.prisma.bookmark.update({
        where: { id: bookmarkId, userId },
        data: {
          ...dto,
        },
      });

      if (!bookmark) {
        throw new Error('Failed to update bookmark');
      }

      return {
        success: true,
        message: 'Bookmark updated successfully',
        bookmark,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error; // re-throw known HTTP exceptions
      }
      throw new Error(`Error updating bookmark: ${error.message}`);
    }
  }

  async deleteBookmark(userId: string, bookmarkId: string) {
    try {
      if (!userId) {
        throw new ForbiddenException('User is not authenticated');
      }
      if (!bookmarkId || bookmarkId === 'null' || bookmarkId === 'invalidId') {
        throw new BadRequestException('Bookmark id is invalid');
      }
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId, userId },
      });
      if (!bookmark) {
        throw new NotFoundException('Bookmark not found');
      }
      await this.prisma.bookmark.delete({
        where: { id: bookmarkId },
      });
      return { success: true, message: 'Bookmark deleted successfully' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error; // re-throw known HTTP exceptions
      }
      throw new Error(`Error deleting bookmark: ${error.message}`);
    }
  }
}

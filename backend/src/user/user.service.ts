/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { emailRegex } from '../regex';
import { editUserDto } from './dto/user.dto';
import { changePasswordPromise, UserPromise } from '../types';
import { JwtGuard } from '../auth/guard';
import { ChangePasswordDto } from './dto';
import { passwordRegex } from '../regex';
import * as argon from 'argon2';

@UseGuards(JwtGuard)
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, dto: editUserDto): Promise<UserPromise> {
    try {
      // Validate the input dto
      if (!userId) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action',
        );
      }
      if (!dto || (!dto.firstName && !dto.lastName)) {
        throw new BadRequestException('No valid fields to update');
      }
      // Check if the user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { emails: true },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Update the user in the database
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { firstName: dto.firstName, lastName: dto.lastName },
        include: { emails: true },
      });

      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      const { hashedPassword, ...userWithoutPassword } = updatedUser;

      return {
        success: true,
        message: 'User updated successfully',
        user: userWithoutPassword,
      };
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw error;
    }
  }

  async getMyUserInfo(userId: string): Promise<UserPromise> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { emails: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const { hashedPassword, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'User info fetched successfully',
        user: userWithoutPassword,
      };
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw error;
    }
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<changePasswordPromise> {
    try {
      if (!userId) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action',
        );
      }
      if (!dto || (!dto.currentPassword && !dto.newPassword)) {
        throw new BadRequestException('No valid fields to update');
      }
      // Check if the user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { emails: true },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const passwordMatch = await argon.verify(
        existingUser.hashedPassword,
        dto.currentPassword,
      );

      if (!passwordMatch) {
        throw new BadRequestException('Old password is incorrect');
      }

      if (!existingUser.hashedPassword) {
        throw new Error('User does not have a password set');
      }

      if (dto.newPassword === dto.currentPassword) {
        throw new BadRequestException(
          'New password cannot be the same as current password',
        );
      }

      // Check if the new password is strong enough
      if (!passwordRegex.test(dto.newPassword)) {
        throw new BadRequestException(
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        );
      }

      // Hash the password
      const hash = await argon.hash(dto.newPassword);
      if (!hash) {
        throw new BadRequestException('Password hashing failed');
      }

      // Update the user in the database
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { hashedPassword: hash },
        include: { emails: true },
      });

      if (!updatedUser) {
        throw new Error('Failed to update user');
      }
      return {
        success: true,
        message: 'User updated successfully',
      };
    } catch (error: any) {
      if (
        error instanceof Error ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw error;
    }
  }

  async deleteUser(userId: string, password: string): Promise<UserPromise> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { emails: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const passwordMatch = await argon.verify(user.hashedPassword, password);

      if (!passwordMatch) {
        throw new BadRequestException('Password is incorrect');
      }

      const bookmarks = await this.prisma.bookmark.deleteMany({
        where: { userId },
      });

      if (!bookmarks) {
        throw new Error('Failed to delete user bookmarks');
      }

      const shorturls = await this.prisma.shortUrl.deleteMany({
        where: { createdById: userId },
      });

      if (!shorturls) {
        throw new Error('Failed to delete user short URLs');
      }

      const emails = await this.prisma.email.deleteMany({
        where: { userId },
      });

      if (!emails) {
        throw new Error('Failed to delete user emails');
      }

      await this.prisma.user.delete({
        where: { id: userId },
      });

      return {
        success: true,
        message: 'User deleted successfully',
        user: null,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error deleting user: ${error.message}`);
      }
      throw new Error('Error deleting user: Unknown error');
    }
  }

  async addEmailToUser(userId: string, email: string): Promise<UserPromise> {
    try {
      // Validate the input
      if (!userId) {
        throw new UnauthorizedException(
          'You are not authorized to perform this action',
        );
      }

      if (!email || !emailRegex.test(email)) {
        throw new BadRequestException('Invalid email format');
      }

      // Check if the user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { emails: true },
      });

      const primaryEmail = existingUser?.emails.find(
        (email) => email.isPrimary,
      );

      if (primaryEmail && primaryEmail.isVerified) {
        throw new BadRequestException(
          'This email is already the primary email',
        );
      }

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Check if the email already exists for the user
      const emailExistsForTheSameUser = await this.prisma.email.findFirst({
        where: { email, userId },
      });

      if (emailExistsForTheSameUser) {
        throw new BadRequestException('Email already exists for this user');
      }

      const emailExistsForOtherUser = await this.prisma.email.findFirst({
        where: { email, userId: { not: userId } },
      });

      if (emailExistsForOtherUser) {
        throw new BadRequestException('Email already exists for another user');
      }

      // Add the email to the user
      const newEmail = await this.prisma.email.create({
        data: { email, userId },
      });
      if (!newEmail) {
        throw new Error('Failed to add email to user');
      }

      const updatedUser = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { emails: true },
      });

      if (!updatedUser) {
        throw new NotFoundException('User not found after adding email');
      }

      return {
        success: true,
        message: 'Email added successfully',
        user: updatedUser,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw error;
    }
  }
}

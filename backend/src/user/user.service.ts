import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { emailRegex } from '../regex';
import { editUserDto } from './dto/user.dto';
import { UserPromise } from '../types';
import { JwtGuard } from '../auth/guard';

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
        data: { ...dto },
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
      throw new Error(`Error updating user: ${error.message}`);
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
      throw new Error(`Error fetching user info: ${error.message}`);
    }
  }

  async deleteUser(userId: string): Promise<UserPromise> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const bookmarks = await this.prisma.bookmark.deleteMany({
        where: { userId },
      });

      await this.prisma.user.delete({
        where: { id: userId },
      });

      return {
        success: true,
        message: 'User deleted successfully',
        user: null,
      };
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
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
      throw new Error(`Error adding email to user: ${error.message}`);
    }
  }
}

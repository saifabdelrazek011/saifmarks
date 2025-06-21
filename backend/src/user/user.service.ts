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
      if (!dto || (!dto.firstName && !dto.lastName && !dto.email)) {
        throw new BadRequestException('No valid fields to update');
      }
      // Check if the user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // validate the email if provided
      if (dto.email && emailRegex.test(dto.email)) {
        // Check if the email is already taken by another user
        const emailExists = await this.prisma.user.findFirst({
          where: { email: dto.email, id: { not: userId } },
        });

        if (emailExists) {
          throw new BadRequestException('Email is already taken');
        }
      }

      dto.firstName ? dto.firstName : (dto.firstName = undefined);
      dto.lastName ? dto.lastName : (dto.lastName = undefined);

      // Update the user in the database
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { ...dto },
      });

      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      const { hashedPassword, ...userWithoutPassword } = updatedUser;

      // Convert nulls to undefined for firstName and lastName
      const userWithUndefined = {
        ...userWithoutPassword,
        firstName:
          userWithoutPassword.firstName === null
            ? undefined
            : userWithoutPassword.firstName,
        lastName:
          userWithoutPassword.lastName === null
            ? undefined
            : userWithoutPassword.lastName,
      };

      return {
        success: true,
        message: 'User updated successfully',
        user: userWithUndefined,
      };
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
}

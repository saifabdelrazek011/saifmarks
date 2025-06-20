import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from '../auth/dto/';
import { emailRegex } from 'src/regex';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: string, data: AuthDto) {
    try {
      // Validate the input dto
      if (!userId || !data) {
        throw new BadRequestException('User ID and data are required');
      }
      // Check if the user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // validate the email and password if provided
      if (data.email && emailRegex.test(data.email)) {
        // Check if the email is already taken by another user
        const emailExists = await this.prisma.user.findFirst({
          where: { email: data.email, id: { not: userId } },
        });

        if (emailExists) {
          throw new BadRequestException('Email is already taken');
        }
      } else if (data.email) {
        throw new BadRequestException('Invalid email format');
      }

      // Update the user in the database
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data,
      });

      return {
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
}

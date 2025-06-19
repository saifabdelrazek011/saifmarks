import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto'; // Adjust the import path as necessary
import * as argon from 'argon2'; // Ensure you have argon2 installed

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hashedPassword: hash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async signin(dto: AuthDto) {
    console.log('signin called with dto:', dto);

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await argon.verify(
      user.hashedPassword,
      dto.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    return user;
  }
}

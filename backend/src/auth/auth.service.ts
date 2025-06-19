import { ForbiddenException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto'; // Adjust the import path as necessary
import * as argon from 'argon2'; // Ensure you have argon2 installed
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { JwtService } from '@nestjs/jwt'; // Ensure you have @nestjs/jwt installed
import { ConfigService } from '@nestjs/config'; // Ensure you have @nestjs/config installed
import { JWTPayloadType, SignTokenPromise } from 'src/types'; // Adjust the import path as necessary

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw new Error('Signup failed');
    }
  }

  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        hashedPassword: true,
      },
    });
    // if user does not exist, throw an error
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // compare the password with the hashed password
    const isPasswordValid = await argon.verify(
      user.hashedPassword,
      dto.password,
    );

    // if password is incorrect, throw an error
    if (!isPasswordValid) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // if everything is correct, return the user without the hashed password
    return {
      success: true,
      message: 'User authenticated',
      access_token: await this.signToken(user.id, user.email),
    };
  }

  async signToken(userId: string, email: string): Promise<SignTokenPromise> {
    const data: JWTPayloadType = {
      sub: userId,
      email,
    };

    const secret = this.config.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    const token = await this.jwt.signAsync(data, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return {
      success: true,
      message: 'Token generated successfully',
      access_token: token,
    };
  }
}

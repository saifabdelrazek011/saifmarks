import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto'; // Adjust the import path as necessary
import * as argon from 'argon2'; // Ensure you have argon2 installed
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/library'; // Ensure you have @prisma/client installed
import { JwtService } from '@nestjs/jwt'; // Ensure you have @nestjs/jwt installed
import { ConfigService } from '@nestjs/config'; // Ensure you have @nestjs/config installed
import { JWTPayloadType, SignTokenPromise } from '../types'; // Adjust the import path as necessary
import { emailRegex, passwordRegex } from '../regex';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      // Validate the input data
      if (!dto || !dto.email || !dto.password) {
        throw new BadRequestException('Email and password are required');
      }

      // Check if regex is defined
      if (!emailRegex || !passwordRegex) {
        throw new Error('Email and password regex are not defined');
      }
      // check if the email is valid
      if (!emailRegex.test(dto.email)) {
        throw new BadRequestException('Invalid email format');
      }
      // check if the password is strong enough
      if (!passwordRegex.test(dto.password)) {
        throw new BadRequestException(
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        );
      }

      // Hash the password
      const hash = await argon.hash(dto.password);
      if (!hash) {
        throw new BadRequestException('Password hashing failed');
      }

      // Check if the user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (existingUser) {
        throw new ForbiddenException('Credentials taken');
      }

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
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new Error('Signup failed');
    }
  }

  async signin(dto: AuthDto) {
    // Validate the input data
    if (!dto || !dto.email || !dto.password) {
      throw new BadRequestException('Email and password are required');
    }

    // Check if regex is defined
    if (!emailRegex) {
      throw new Error('Email regex is not defined');
    }
    // check if the email is valid
    if (!emailRegex.test(dto.email)) {
      throw new BadRequestException('Invalid email format');
    }

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

  async signToken(userId: string, email: string): Promise<string> {
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

    return token;
  }
}

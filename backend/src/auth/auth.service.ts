import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTPayloadType } from '../types';
import { emailRegex, passwordRegex } from '../regex';
import { JWT_SECRET, NODE_ENV } from '../../config';
import { SignInReturnType } from '../types';
import { Response } from 'express';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: SignUpDto) {
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
      const existingUser = await this.prisma.user.findFirst({
        where: {
          emails: {
            some: { email: dto.email },
          },
        },
      });

      if (existingUser) {
        throw new ForbiddenException('Credentials taken');
      }

      const user = await this.prisma.user.create({
        data: {
          hashedPassword: hash,
          emails: {
            create: [{ email: dto.email }],
          },
        },
        include: {
          emails: true,
        },
      });

      const { hashedPassword, ...userWithoutPassword } = user;

      return {
        success: true,
        message: 'The User Signed up successfully',
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return {
            success: false,
            message: 'Credentials taken',
            user: null,
          };
        }
      }
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        return {
          success: false,
          message: error.message,
          user: null,
        };
      }
      return {
        success: false,
        message: 'Signup failed',
        user: null,
      };
    }
  }

  async signin(dto: SignInDto, res: Response): Promise<SignInReturnType> {
    try {
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
      const user = await this.prisma.user.findFirst({
        where: {
          emails: {
            some: { email: dto.email },
          },
        },
        include: {
          emails: true,
        },
      });
      // if user does not exidst, throw an error
      if (!user) {
        throw new ForbiddenException('You are not registered');
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

      const { hashedPassword, ...userWithoutPassword } = user;

      // Generate a JWT token
      if (!JWT_SECRET) {
        throw new BadRequestException('JWT_SECRET is not defined');
      }

      const token = await this.signToken(user.id, user.emails[0].email);

      if (!token) {
        throw new BadRequestException('Token generation failed');
      }

      // If the token is successfully generated, set the cookie
      if (!res || typeof res.cookie !== 'function') {
        throw new BadRequestException('Response object is invalid');
      }

      res
        .cookie('Authorization', 'Bearer ' + token, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 8 * 3600000,

          path: '/',
        })
        .status(200);

      // if everything is correct, return the user without the hashed password
      return {
        success: true,
        message: 'User authenticated',
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return {
            success: false,
            message: 'Credentials taken',
            user: null,
          };
        }
      }
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      return {
        success: false,
        message: 'Signin failed',
        user: null,
      };
    }
  }

  // Functions
  async signToken(userId: string, email: string): Promise<string> {
    try {
      if (!userId || !email) {
        throw new BadRequestException(
          'User ID and email are required to sign a token',
        );
      }

      // Validate the userId and email
      if (typeof userId !== 'string' || typeof email !== 'string') {
        throw new BadRequestException('Invalid user ID or email format');
      }

      const data: JWTPayloadType = {
        sub: userId,
        email,
      };

      const secret = this.config.get<string>('JWT_SECRET');

      if (!secret) {
        throw new Error(
          'JWT_SECRET is not defined in the environment variables',
        );
      }

      const token = await this.jwt.signAsync(data, {
        expiresIn: '7d',
        secret: JWT_SECRET,
      });

      return token;
    } catch (error) {
      throw new Error(`Error signing token: ${error.message}`);
    }
  }

  async signout(res: Response): Promise<void> {
    try {
      if (!res || typeof res.clearCookie !== 'function') {
        throw new BadRequestException('Response object is invalid');
      }

      res
        .clearCookie('Authorization', {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        })
        .status(200);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(`Signout failed: ${error.message}`);
    }
  }
}

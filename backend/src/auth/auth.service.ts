/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTPayloadType, SignOutReturnType } from '../types';
import { emailRegex, passwordRegex } from '../regex';
import { JWT_SECRET, NODE_ENV } from '../../config';
import { SignInReturnType } from '../types';
import { Response } from 'express';
import { EmailService } from 'src/email/email.service';

// Generate a random 6-digit number as a string
function generateVerificationToken(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private emailService: EmailService, // Assuming EmailService is defined and imported correctly
  ) {}

  async signup(dto: SignUpDto) {
    try {
      // Validate the input data
      if (!dto || !dto.email || !dto.password) {
        throw new BadRequestException('Email and password are required');
      }

      if (!dto.firstName || !dto.lastName) {
        throw new BadRequestException('First name and last name are required');
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
          firstName: dto.firstName ? dto.firstName : '',
          lastName: dto.lastName ? dto.lastName : '',
          hashedPassword: hash,
          emails: {
            create: [{ email: dto.email, isPrimary: true }],
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
          throw error;
        }
      }
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof Error
      ) {
        throw error;
      }
      throw error;
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
          throw error;
        }
      }
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof Error
      ) {
        throw error;
      }
      throw error;
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
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message?: string }).message
          : 'Unknown error';
      throw new Error(`Error signing token: ${errorMessage}`);
    }
  }

  signout(res: Response): SignOutReturnType {
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
      return {
        success: true,
        message: 'User signout successfully',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof Error
      ) {
        throw error;
      }
      throw error;
    }
  }

  async sendVerificationEmail(
    userId: string,
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!email || !emailRegex.test(email)) {
        throw new BadRequestException('Invalid email format');
      }

      // Check if the user exists
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const updateEmail = await this.prisma.email.findFirst({
        where: {
          email,
          userId: user.id,
        },
      });

      if (!updateEmail) {
        throw new BadRequestException('Email not found for the user');
      }

      if (updateEmail.isVerified) {
        throw new BadRequestException('Email is already verified');
      }

      if (
        updateEmail.verificationToken &&
        updateEmail.verificationExpires !== null &&
        updateEmail?.verificationExpires > new Date()
      ) {
        throw new BadRequestException(
          'Verification email already sent. Please check your inbox.',
        );
      }

      const token = generateVerificationToken();

      if (!token) {
        throw new BadRequestException('Token generation failed');
      }

      const hashToken = await argon.hash(token);

      // Update the email with the verification token and expiration
      await this.prisma.email.update({
        where: { email: updateEmail?.email },
        data: {
          verificationToken: hashToken,
          verificationExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
          isVerified: false,
        },
      });

      // Send the verification email
      await this.emailService.sendVerificationEmail({
        to: email,
        subject: 'Email Verification',
        token,
      });

      return {
        success: true,
        message: 'Verification email sent successfully',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof Error
      ) {
        throw error;
      }
      throw error;
    }
  }

  async verifyEmail(userId: string, email: string, token: string) {
    try {
      if (!userId || !email || !token) {
        throw new BadRequestException('User ID, email, and token are required');
      }
      const verificationEmail = await this.prisma.email.findFirst({
        where: {
          userId,
          email,
        },
      });

      if (!verificationEmail) {
        throw new BadRequestException('Invalid or expired verification token');
      }

      if (!verificationEmail.verificationToken) {
        throw new BadRequestException(
          'There is no verification token set to the user',
        );
      }
      // Check if the verification token has expired
      if (
        verificationEmail.verificationExpires &&
        new Date(verificationEmail.verificationExpires) < new Date()
      ) {
        throw new BadRequestException('Verification token has expired');
      }

      const isTokenValid = await argon.verify(
        verificationEmail.verificationToken,
        token,
      );

      if (!isTokenValid) {
        throw new BadRequestException('Invalid verification token');
      }

      // Mark user as verified and clear the token
      const updatedEmail = await this.prisma.email.update({
        where: { email: verificationEmail.email },
        data: {
          isVerified: true,
          verificationToken: null,
          verificationExpires: null,
        },
      });

      if (!updatedEmail) {
        throw new BadRequestException('Email verification failed');
      }

      return {
        success: true,
        message: 'Email verified successfully',
        email: updatedEmail,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException ||
        error instanceof Error
      ) {
        throw error;
      }
      throw error;
    }
  }

  async sendResetPasswordEmail(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!email) {
        throw new BadRequestException('User email is required');
      }

      const existingEmail = await this.prisma.email.findUnique({
        where: { email },
      });

      if (!existingEmail) {
        throw new NotFoundException('The email not found');
      }

      const existingUser = await this.prisma.user.findUnique({
        where: { id: existingEmail.userId },
      });

      if (!existingUser) {
        throw new NotFoundException("The user doesn't exist");
      }

      const code = generateVerificationToken();

      if (!code) {
        throw new Error('Erro while generating the reset code');
      }

      const hashCode = await argon.hash(code);

      if (!hashCode) {
        throw new Error('Error while hashing code');
      }

      await this.emailService.sendResetPasswordCodeEmail({ code, to: email });

      const updateUser = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          resetPasswordToken: hashCode,
          resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
      });

      if (!updateUser) {
        throw new Error('Failed to update user with reset password token');
      }

      return {
        success: true,
        message: 'Reset password email sent successfully',
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

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { emails: { some: { email } } },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user?.resetPasswordToken || !user?.resetPasswordExpires) {
        throw new BadRequestException('There is no reset password token set');
      }

      if (typeof user.resetPasswordToken !== 'string') {
        throw new BadRequestException('Invalid reset password token type');
      }

      const isTokenValid = await argon.verify(user.resetPasswordToken, code);

      if (!isTokenValid) {
        throw new BadRequestException('Invalid reset password token');
      }

      if (!newPassword || !passwordRegex.test(newPassword)) {
        throw new BadRequestException(
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        );
      }

      const usedOldPassword = await argon.verify(
        user.hashedPassword,
        newPassword,
      );

      if (usedOldPassword) {
        throw new BadRequestException('You cannot use your old password');
      }

      if (
        user.resetPasswordExpires &&
        new Date(user.resetPasswordExpires) < new Date()
      ) {
        throw new BadRequestException('Reset password token has expired');
      }

      const hashedPassword = await argon.hash(newPassword);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          hashedPassword: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });
      return {
        success: true,
        message: 'Password reset successfully',
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
}

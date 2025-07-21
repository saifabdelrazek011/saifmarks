import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { Response } from 'express';
import { GetUser } from './decorator';
import { JwtGuard } from './guard';
import { UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SignInDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(dto, res);
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signout(@Res({ passthrough: true }) res: Response) {
    return this.authService.signout(res);
  }

  @UseGuards(JwtGuard)
  @Patch('verification')
  @HttpCode(HttpStatus.OK)
  verifyEmail(
    @GetUser('id') id: string,
    @Body('email') email: string,
    @Body('token') token: string,
  ) {
    return this.authService.verifyEmail(id, email, token);
  }

  @UseGuards(JwtGuard)
  @Patch('verification/send')
  @HttpCode(HttpStatus.OK)
  sendVerificationEmail(
    @GetUser('id') id: string,
    @Body('email') email: string,
  ) {
    return this.authService.sendVerificationEmail(id, email);
  }

  @Patch('password/reset/send')
  sendResetPasswordEmail(@Body('email') email: string) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Patch('password/reset')
  resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
    @Body('token') token: string,
  ) {
    return this.authService.resetPassword(email, newPassword, token);
  }
}

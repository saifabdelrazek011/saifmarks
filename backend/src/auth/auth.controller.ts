import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  test() {
    return { message: 'Test endpoint is working!' };
  }

  // @Post('me')
  // me(@Body('userId', ParseIntPipe) userId: number) {
  //   console.log({ userId });
  //   return this.authService.me(userId);
  // }
}

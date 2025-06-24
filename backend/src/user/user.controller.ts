import { Controller, Req, Res, UseGuards } from '@nestjs/common';
import { Get, Patch } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return this.userService.getMyUserInfo(user.id);
  }

  @Patch('me')
  editUser(@GetUser('id') userId: string, @Req() req: Request) {
    return this.userService.editUser(userId, req.body);
  }
}

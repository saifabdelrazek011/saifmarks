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
    return { message: 'User details', user };
  }

  @Patch('me')
  editUser(@GetUser() user: User, @Req() req: Request) {
    return this.userService.editUser(user.id, req.body);
  }
}

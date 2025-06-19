import { Controller, Req, Res, UseGuards } from '@nestjs/common';
import { Get, Patch } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from 'generated/prisma';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  @Get('me')
  getMe(@GetUser() user: User, @GetUser('email') email: string) {
    return { message: 'User details', user, email };
  }

  @Patch()
  editUser(@GetUser() user: User, @Req() req: Request) {
    // Here you would typically handle the user update logic
    // For example, you might extract the new data from req.body
    // and update the user in the database.
    // This is a placeholder implementation.

    const updatedUser = { ...user, ...req.body }; // Simulating an update
    return { message: 'User updated', user: updatedUser };
  }
}

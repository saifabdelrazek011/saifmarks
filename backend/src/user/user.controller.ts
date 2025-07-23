import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { Get, Patch } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { UserService } from './user.service';
import { ChangePasswordDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser('id') userId: string) {
    return this.userService.getMyUserInfo(userId);
  }

  @Patch('me')
  editUser(
    @GetUser('id') userId: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
  ) {
    return this.userService.editUser(userId, { firstName, lastName });
  }

  @Delete('me')
  deleteUser(
    @GetUser('id') userId: string,
    @Body('password') password: string,
  ) {
    return this.userService.deleteUser(userId, password);
  }

  @Patch('password')
  changePassword(
    @GetUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, dto);
  }
}

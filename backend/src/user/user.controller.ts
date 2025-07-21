import { Body, Controller, Delete, UseGuards } from '@nestjs/common';
import { Get, Patch } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { UserService } from './user.service';
import { editUserDto, ChangePasswordDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser('id') userId: string) {
    console.log('Fetching user info for userId:', userId);
    return this.userService.getMyUserInfo(userId);
  }

  @Patch('me')
  editUser(@GetUser('id') userId: string, @Body() dto: editUserDto) {
    return this.userService.editUser(userId, dto);
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

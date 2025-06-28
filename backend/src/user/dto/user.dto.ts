import { IsEmail, IsString, Length } from 'class-validator';

export class editUserDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
}

export class editPasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @Length(6, 100)
  newPassword: string;
}

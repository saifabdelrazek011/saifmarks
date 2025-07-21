import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

export class editUserDto {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEmail()
  email?: string;
}

export class editPasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @Length(6, 100)
  newPassword: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  newPassword: string;
}

import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  url: string;

  @IsString()
  description?: string;

  @IsArray()
  tags?: string[];
}

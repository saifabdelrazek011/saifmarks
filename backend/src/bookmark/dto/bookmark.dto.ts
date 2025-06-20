import { IsNotEmpty, IsString, Length } from 'class-validator';

export class BookmarkDto {
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
}

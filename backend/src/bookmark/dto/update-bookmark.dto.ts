import { IsArray, IsOptional, IsString, Length } from 'class-validator';

export class UpdateBookmarkDto {
  @IsString()
  @Length(1, 100)
  @IsOptional()
  title: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

}

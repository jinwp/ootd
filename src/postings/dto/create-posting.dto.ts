import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostingDto {
  @IsString({
    message: '제목은 문자열로만 가능합니다',
  })
  @MaxLength(255, {
    message: '내용이 너무 깁니다',
  })
  text: string;

  @IsOptional()
  @IsString()
  semester: string;
}

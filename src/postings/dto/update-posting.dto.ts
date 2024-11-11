import { PartialType } from '@nestjs/mapped-types';
import { CreatePostingDto } from './create-posting.dto';

export class UpdateTodoDto extends PartialType(CreatePostingDto) {}

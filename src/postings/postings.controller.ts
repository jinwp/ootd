import {
  BadRequestException,
  Body,
  Controller,
  Delete, ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { PostingsService } from './postings.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostingDto } from './dto/create-posting.dto';
import { UpdatePostingDto } from './dto/update-posting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('postings')
export class PostingsController {
  constructor(private readonly postingsService: PostingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async createPosting(
    @Body() createPostingDto: CreatePostingDto,
    @Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log(createPostingDto);
    const user_id = req.user.user_id;
    return this.postingsService.create(createPostingDto, user_id, files);
  }

  @Get()
  async getAllPostingWithFilter(
    @Query('semester') semester?: string,
    @Query('minHeight') minHeight?: string,
    @Query('maxHeight') maxHeight?: string,
    @Query('minWeight') minWeight?: string,
    @Query('maxWeight') maxWeight?: string,
  ) {
    const parsedMinHeight = minHeight ? parseFloat(minHeight) : undefined;
    const parsedMaxHeight = maxHeight ? parseFloat(maxHeight) : undefined;
    const parsedMinWeight = minWeight ? parseFloat(minWeight) : undefined;
    const parsedMaxWeight = maxWeight ? parseFloat(maxWeight) : undefined;
    return this.postingsService.findAll(
      semester,
      parsedMinHeight,
      parsedMaxHeight,
      parsedMinWeight,
      parsedMaxWeight,
    );
  }

  @Get(':user_id')
  async findPostingsByUser(@Param('user_id') user_id: string) {
    return this.postingsService.findByUser(user_id);
  }

  @Post(':post_id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async updatePosting(
    @Body() updatePostingDto: UpdatePostingDto,
    @Param('post_id') post_id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Request() req,
  ) {
    const user_id = req.user.user_id;
    const post = await this.postingsService.findByPostId(post_id);

    if (!post || post.user_id !== user_id) {
      throw new ForbiddenException('You cannot update other people posting');
    }
    return this.postingsService.update(updatePostingDto, post_id, files);
  }

  @Delete(':post_id')
  @UseGuards(JwtAuthGuard)
  async deletePosting(@Param('post_id') post_id: string) {
    return this.postingsService.remove(post_id);
  }
}

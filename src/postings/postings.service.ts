import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma.service";
import { CreatePostingDto } from "./dto/create-posting.dto";
import { posting } from "@prisma/client";
import { UpdatePostingDto } from "./dto/update-posting.dto";

@Injectable()
export class PostingsService {

  constructor(private prismaService: PrismaService) {}

  async create(createPostingDto: CreatePostingDto) : Promise<posting> {
    return this.prismaService.posting.create({
      data: {
        text: createPostingDto.text,
        semester: createPostingDto.semester,
      },
    });
  }

  async findAll() {
    return this.prismaService.posting.findMany({
      include: {
        images: true,
        uploader: true,
      },
    });
  }

  async findOne(post_id: string) : Promise<posting> {
    return this.prismaService.posting.findUnique({
      where: {
        post_id: post_id,
      },
      include: {
        images: true,
        uploader: true,
      },
    });
  }

  async update(
    post_id: string,
    updatePostingDto: UpdatePostingDto,
  ): Promise<posting> {
    const { text, semester } = updatePostingDto;
    return this.prismaService.posting.update({
      where: { post_id: post_id },
      data: {
        text,
        semester,
      },
      include: {
        images: true,
      },
    });
  }

  async remove(post_id: string) : Promise<posting> {
    return this.prismaService.posting.delete({
      where: { post_id: post_id },
    });
  }
}

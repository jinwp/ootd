import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostingDto } from './dto/create-posting.dto';
import { posting } from '@prisma/client';
import { UpdatePostingDto } from './dto/update-posting.dto';
import * as AWS from 'aws-sdk';
import * as process from 'node:process';

@Injectable()
export class PostingsService {
  constructor(private prismaService: PrismaService) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }
  private s3 = new AWS.S3();

  private async uploadImagesToAWS(files: Express.Multer.File[]) {
    const images = [];
    for (const file of files) {
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `postings/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const { Location } = await this.s3.upload(uploadParams).promise();
      images.push({ imageUrl: Location });
    }
    return images;
  }

  async create(
    createPostingDto: CreatePostingDto,
    user_id: string,
    files: Express.Multer.File[],
  ): Promise<posting> {
    const imageUrls = await this.uploadImagesToAWS(files);
    const { text, semester } = createPostingDto;

    const post = await this.prismaService.posting.create({
      data: {
        user_id: user_id,
        text: text,
        date_created: new Date(),
        semester: semester,
        images: {
          create: imageUrls,
        },
      },
      include: {
        images: true,
      },
    });

    return post;
  }

  async findAll(
    semester?: string,
    minHeight?: number,
    maxHeight?: number,
    minWeight?: number,
    maxWeight?: number,
  ) {
    return this.prismaService.posting.findMany({
      where: {
        ...(semester && { semester: semester }),
        uploader: {
          ...(minHeight && { height: { gte: minWeight } }),
          ...(maxHeight && { height: { lte: maxHeight } }),
          ...(minWeight && { weight: { gte: minWeight } }),
          ...(maxWeight && { weight: { lte: maxWeight } }),
        },
      },
      orderBy: {
        date_created: 'desc',
      },
      include: {
        images: true,
        uploader: true,
      },
    });
  }

  async findByUser(user_id: string) {
    return this.prismaService.posting.findMany({
      where: {
        user_id: user_id,
      },
      orderBy: {
        date_created: 'desc',
      },
      include: {
        images: true,
        uploader: true,
      },
    });
  }

  async update(
    updatePostingDto: UpdatePostingDto,
    post_id: string,
    files: Express.Multer.File[],
  ): Promise<posting> {
    const imageUrls = await this.uploadImagesToAWS(files);
    const { text, semester } = updatePostingDto;

    const post = await this.prismaService.posting.update({
      where: {
        post_id: post_id,
      },
      data: {
        text: text,
        semester: semester,
        images: {
          create: imageUrls,
        },
      },
      include: {
        images: true,
      },
    });

    return post;
  }

  async remove(post_id: string): Promise<posting> {
    return this.prismaService.posting.delete({
      where: { post_id: post_id },
    });
  }
}

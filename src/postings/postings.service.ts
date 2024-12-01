import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostingDto } from './dto/create-posting.dto';
import { posting } from '@prisma/client';
import { UpdatePostingDto } from './dto/update-posting.dto';
import * as AWS from 'aws-sdk';
import * as process from 'node:process';
import { ListBucketsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostingsService {
  private s3Client: S3Client;

  constructor(private prismaService: PrismaService) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  private async uploadImagesToAWS(files: Array<Express.Multer.File>) {
    if (!Array.isArray(files)) {
      files = [files];
    }

    const images = [];
    for (const file of files) {
      const fileName = `postings/${uuidv4()}-${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      // const uploadParams = {
      //   Bucket: process.env.AWS_S3_BUCKET_NAME!,
      //   Key: `postings/${Date.now()}-${file.originalname}`,
      //   Body: file.buffer,
      //   ContentType: file.mimetype,
      // };

      const command = new PutObjectCommand(uploadParams);
      await this.s3Client.send(command);

      const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      images.push({ imageUrl });
    }
    return images;
  }

  async create(
    createPostingDto: CreatePostingDto,
    user_id: string,
    files: Express.Multer.File[],
  ) {
    const imageUrls = await this.uploadImagesToAWS(files);
    const { text, semester } = createPostingDto;

    const post = await this.prismaService.posting.create({
      data: {
        user_id,
        text,
        date_created: new Date(),
        semester,
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

  async findByPostId(post_id: string) {
    return this.prismaService.posting.findUnique({
      where: {
        post_id: post_id,
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

    const currentPost = await this.prismaService.posting.findUnique({
      where: { post_id },
      include: { images: true },
    });

    const imageIdsToDelete = currentPost.images.map((image) => image.id);
    if (imageIdsToDelete.length > 0) {
      await this.prismaService.image.deleteMany({
        where: { id: { in: imageIdsToDelete } },
      });
    }

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

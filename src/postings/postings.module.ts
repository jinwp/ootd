import { Module } from '@nestjs/common';
import { PostingsService } from './postings.service';
import { PostingsController } from './postings.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [PostingsService, PrismaService],
  controllers: [PostingsController],
})
export class PostingsModule {}

import { Module } from '@nestjs/common';
import { PostingsService } from './postings.service';
import { PostingsController } from './postings.controller';

@Module({
  providers: [PostingsService],
  controllers: [PostingsController]
})
export class PostingsModule {}

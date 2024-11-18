import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostingsModule } from './postings/postings.module';
import { ChatGateway } from './chat/chat.gateway';
import { PrismaService } from "./prisma.service";

@Module({
  imports: [AuthModule, UsersModule, PostingsModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway, PrismaService],
})
export class AppModule {}

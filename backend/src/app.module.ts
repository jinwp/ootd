import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostingsModule } from './postings/postings.module';
import { ChatGateway } from './chat/chat.gateway';
import { PrismaService } from "./prisma.service";
import { ChatController } from './chat/chat.controller';
import { ChatService } from "./chat/chat.service";
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, PostingsModule],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatGateway, PrismaService, ChatService],
})
export class AppModule {}

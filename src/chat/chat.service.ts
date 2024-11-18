import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async createChatroom(first_user_id: string, second_user_id: string) {
    try {
      const [user1, user2] = first_user_id < second_user_id ? [first_user_id, second_user_id] : [second_user_id, first_user_id];

      const existingChatRoom = await this.prismaService.chatRoom.findUnique({
        where: {
          first_user_id_second_user_id: {
            first_user_id: user1,
            second_user_id: user2,
          },
        },
      });

      if (!existingChatRoom) {
        await this.prismaService.chatRoom.create({
          data: {
            first_user_id: user1,
            second_user_id: user2,
          },
        });
      }
    } catch {
      throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFirstTenMessages(first_user_id: string, second_user_id: string) {
    try {
      const [user1, user2] = first_user_id < second_user_id ? [first_user_id, second_user_id] : [second_user_id, first_user_id];

      const existingChatRoom = await this.prismaService.chatRoom.findUnique({
        where: {
          first_user_id_second_user_id: {
            first_user_id: user1,
            second_user_id: user2,
          },
        },
      });
      if (!existingChatRoom) {
        throw new Error('No Chatroom');
      }

      const messages = await this.prismaService.message.findMany({
        where: {
          room_id: existingChatRoom.room_id,
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 10,
      });

      return messages;
    } catch {
      throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

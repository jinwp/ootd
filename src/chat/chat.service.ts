import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async createChatroom(first_user_id: string, second_user_id: string) {
    try {
      const [user1, user2] = first_user_id < second_user_id ? [first_user_id, second_user_id] : [second_user_id, first_user_id];

      await this.prismaService.$transaction(async (prisma) => {
        const existingChatRoom = await prisma.chatRoom.findUnique({
          where: {
            first_user_id_second_user_id: {
              first_user_id: user1,
              second_user_id: user2,
            },
          },
        });

        if (!existingChatRoom) {
          await prisma.chatRoom.create({
            data: {
              first_user_id: user1,
              second_user_id: user2,
            },
          });
        }
      });
    } catch {
      throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserChatrooms(user_id: string) {
    try {
      const chatrooms = await this.prismaService.chatRoom.findMany({
        where: {
          OR: [
            { first_user_id: user_id },
            { second_user_id: user_id }
          ]
        },
        include: {
          first_user: { select: { user_id: true, name: true } },
          second_user: { select: { user_id: true, name: true } }
        }
      });

      const result = chatrooms.map((chatroom) => ({
        room_id: chatroom.room_id,
        other_user_name: chatroom.first_user_id === user_id ? chatroom.second_user.name : chatroom.first_user.name
      }));
      console.log(result);
      return result;

    } catch (error) {
      throw new HttpException("Unable to fetch chatrooms", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFirstTenMessages(room_id: string, limit: number = 10, offset: number = 0) {
    try {
      const existingChatRoom = await this.prismaService.chatRoom.findUnique({
        where: {
          room_id: room_id,
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
        take: limit,
        skip: offset,
      });

      return messages;
    } catch {
      throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

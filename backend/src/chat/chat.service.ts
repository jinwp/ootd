import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async createChatroom(first_user_id: string, second_user_id: string) {
    try {
      const [user1, user2] =
        first_user_id < second_user_id
          ? [first_user_id, second_user_id]
          : [second_user_id, first_user_id];

      // Use an array-based transaction for sequential operations
      const transactionResult = await this.prismaService.$transaction([
        this.prismaService.chatRoom.findUnique({
          where: {
            first_user_id_second_user_id: {
              first_user_id: user1,
              second_user_id: user2,
            },
          },
        }),
      ]);

      const existingChatRoom = transactionResult[0];

      if (!existingChatRoom) {
        await this.prismaService.$transaction([
          this.prismaService.chatRoom.create({
            data: {
              first_user_id: user1,
              second_user_id: user2,
            },
          }),
        ]);
      }
    } catch (error) {
      if (error.code === 'P2002') {
        return;
      }
      throw new HttpException('error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserChatrooms(user_id: string) {
    try {
      const chatrooms = await this.prismaService.chatRoom.findMany({
        where: {
          OR: [{ first_user_id: user_id }, { second_user_id: user_id }],
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

  async getSpecificChatroom(first_user_id: string, second_user_id: string) {
    try {
      const chatroom = await this.prismaService.chatRoom.findFirst({
        where: {
          OR: [
            {
              first_user_id: first_user_id,
              second_user_id: second_user_id,
            },
            {
              first_user_id: second_user_id,
              second_user_id: first_user_id,
            },
          ],
        },
        include: {
          first_user: { select: { user_id: true, name: true } },
          second_user: { select: { user_id: true, name: true } },
        },
      });
      const result = {
        room_id: chatroom.room_id,
      };
      return result;
    } catch (error) {
      throw new HttpException("Unable to fetch the chatroom", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMessages(room_id: string, limit: number = 100, offset: number = 0) {
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

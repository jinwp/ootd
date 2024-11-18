import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger(ChatGateway.name);

  constructor(private readonly prisma: PrismaService) {}

  afterInit(server: Server) {
    this.logger.log('웹소켓 서버 초기화');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { room_id: string; sender_id: string; message: string },
  ): Promise<void> {
    try {
      this.logger.log(`Message from client ${client.id} in ${payload.room_id}: ${payload.message}`);

      const newMessage = await this.prisma.message.create({
        data: {
          room_id: payload.room_id,
          sender_id: payload.sender_id,
          content: payload.message,
          // chatRoom: {
          //   connect: { room_id: payload.room_id },
          // },
        },
      });

      this.server.to(payload.room_id).emit('message', {
        user: client.id,
        message: payload.message,
        timestamp: newMessage.timestamp,
      });
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}

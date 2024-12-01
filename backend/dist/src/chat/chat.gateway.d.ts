import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly prisma;
    server: Server;
    private logger;
    constructor(prisma: PrismaService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, room_id: string): Promise<void>;
    handleMessage(client: Socket, payload: {
        room_id: string;
        sender_id: string;
        message: string;
    }): Promise<void>;
}

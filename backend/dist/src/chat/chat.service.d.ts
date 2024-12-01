import { PrismaService } from '../prisma.service';
export declare class ChatService {
    private prismaService;
    constructor(prismaService: PrismaService);
    createChatroom(first_user_id: string, second_user_id: string): Promise<void>;
    getUserChatrooms(user_id: string): Promise<{
        room_id: string;
        other_user_name: string;
    }[]>;
    getSpecificChatroom(first_user_id: string, second_user_id: string): Promise<{
        room_id: string;
    }>;
    getMessages(room_id: string, limit?: number, offset?: number): Promise<{
        room_id: string;
        message_id: string;
        sender_id: string;
        content: string;
        timestamp: Date;
    }[]>;
}

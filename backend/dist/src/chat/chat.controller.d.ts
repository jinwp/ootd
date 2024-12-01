import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getUserChatrooms(req: any): Promise<{
        room_id: string;
        other_user_name: string;
    }[]>;
    getSpecificChatroom(req: any, second_user_id: string): Promise<{
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

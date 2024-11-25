import { Controller, Get, Param, Query, Request, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('chatrooms')
  async getUserChatrooms(@Request() req) {
    const user_id = req.user.user_id; // Assuming `userId` is attached to `req.user` via JWT.
    return this.chatService.getUserChatrooms(user_id);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('messages/:room_id')
  async getMessages(@Param('room_id') room_id: string, @Query('limit') limit = 10, @Query('offset') offset = 0) {
    return await this.chatService.getFirstTenMessages(room_id, Number(limit), Number(offset));
  }

}

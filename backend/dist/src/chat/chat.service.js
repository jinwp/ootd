"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ChatService = class ChatService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createChatroom(first_user_id, second_user_id) {
        try {
            const [user1, user2] = first_user_id < second_user_id
                ? [first_user_id, second_user_id]
                : [second_user_id, first_user_id];
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
        }
        catch (error) {
            if (error.code === 'P2002') {
                return;
            }
            throw new common_1.HttpException('error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserChatrooms(user_id) {
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
        }
        catch (error) {
            throw new common_1.HttpException("Unable to fetch chatrooms", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getSpecificChatroom(first_user_id, second_user_id) {
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
        }
        catch (error) {
            throw new common_1.HttpException("Unable to fetch the chatroom", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMessages(room_id, limit = 100, offset = 0) {
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
        }
        catch {
            throw new common_1.HttpException('error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map
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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const chat_service_1 = require("../chat/chat.service");
let AuthService = class AuthService {
    constructor(prismaService, userService, jwtService, chatService) {
        this.prismaService = prismaService;
        this.userService = userService;
        this.jwtService = jwtService;
        this.chatService = chatService;
    }
    async validateUser(email, pass) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: email,
            },
        });
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async signUp(createUserDto) {
        const hashPassword = await bcrypt.hash(createUserDto.password, 10);
        try {
            const newUser = await this.prismaService.user.create({
                data: {
                    ...createUserDto,
                    password: hashPassword,
                    date_joined: new Date(),
                },
            });
            const existingUsers = await this.prismaService.user.findMany({
                where: {
                    NOT: { user_id: newUser.user_id },
                },
            });
            for (const existingUser of existingUsers) {
                await this.chatService.createChatroom(newUser.user_id, existingUser.user_id);
            }
            return newUser;
        }
        catch {
            throw new common_1.HttpException('username already exists', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async login(user) {
        const payload = { user_id: user.user_id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        jwt_1.JwtService,
        chat_service_1.ChatService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
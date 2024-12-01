import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ChatService } from '../chat/chat.service';
export declare class AuthService {
    private readonly prismaService;
    private userService;
    private jwtService;
    private chatService;
    constructor(prismaService: PrismaService, userService: UsersService, jwtService: JwtService, chatService: ChatService);
    validateUser(email: string, pass: string): Promise<any>;
    signUp(createUserDto: CreateUserDto): Promise<{
        name: string;
        user_id: string;
        email: string;
        password: string;
        date_joined: Date;
        height: number;
        weight: number;
    }>;
    login(user: any): Promise<{
        access_token: string;
    }>;
}

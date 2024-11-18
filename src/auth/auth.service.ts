import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private userService: UsersService,
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
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

  async signUp(createUserDto: CreateUserDto) {
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
        await this.chatService.createChatroom(newUser.user_id, existingUser.user_id)
      }

      return newUser;
    } catch {
      throw new HttpException(
        'username already exists',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(user: any) {
    const payload = { user_id: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

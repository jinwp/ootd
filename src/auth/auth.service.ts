import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(id: string, pass: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        user_id: id,
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
      await this.prismaService.user.create({
        data: {
          password: hashPassword,
          date_joined: new Date(),
          ...createUserDto,
        },
      });
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

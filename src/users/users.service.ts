import { Injectable, Post } from '@nestjs/common';
import { user } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findUser(id: string): Promise<user> {
    return this.prismaService.user.findUnique({
      where: {
        user_id: id,
      },
      include: {
        postings: true,
      },
    });
  }
}

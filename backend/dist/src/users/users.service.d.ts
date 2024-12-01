import { user } from '@prisma/client';
import { PrismaService } from '../prisma.service';
export declare class UsersService {
    private prismaService;
    constructor(prismaService: PrismaService);
    findUser(id: string): Promise<user>;
}

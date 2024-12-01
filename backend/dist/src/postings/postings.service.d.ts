import { PrismaService } from '../prisma.service';
import { CreatePostingDto } from './dto/create-posting.dto';
import { posting } from '@prisma/client';
import { UpdatePostingDto } from './dto/update-posting.dto';
export declare class PostingsService {
    private prismaService;
    private s3Client;
    constructor(prismaService: PrismaService);
    private uploadImagesToAWS;
    create(createPostingDto: CreatePostingDto, user_id: string, files: Express.Multer.File[]): Promise<{
        images: {
            id: string;
            imageUrl: string;
        }[];
    } & {
        user_id: string;
        semester: string | null;
        text: string;
        post_id: string;
        date_created: Date;
    }>;
    findAll(semester?: string, minHeight?: number, maxHeight?: number, minWeight?: number, maxWeight?: number): Promise<({
        uploader: {
            name: string;
            user_id: string;
            email: string;
            password: string;
            date_joined: Date;
            height: number;
            weight: number;
        };
        images: {
            id: string;
            imageUrl: string;
        }[];
    } & {
        user_id: string;
        semester: string | null;
        text: string;
        post_id: string;
        date_created: Date;
    })[]>;
    findByUser(user_id: string): Promise<({
        uploader: {
            name: string;
            user_id: string;
            email: string;
            password: string;
            date_joined: Date;
            height: number;
            weight: number;
        };
        images: {
            id: string;
            imageUrl: string;
        }[];
    } & {
        user_id: string;
        semester: string | null;
        text: string;
        post_id: string;
        date_created: Date;
    })[]>;
    findByPostId(post_id: string): Promise<{
        user_id: string;
        semester: string | null;
        text: string;
        post_id: string;
        date_created: Date;
    }>;
    update(updatePostingDto: UpdatePostingDto, post_id: string, files: Express.Multer.File[]): Promise<posting>;
    remove(post_id: string): Promise<posting>;
}

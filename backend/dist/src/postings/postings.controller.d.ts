import { PostingsService } from './postings.service';
import { CreatePostingDto } from './dto/create-posting.dto';
import { UpdatePostingDto } from './dto/update-posting.dto';
export declare class PostingsController {
    private readonly postingsService;
    constructor(postingsService: PostingsService);
    createPosting(createPostingDto: CreatePostingDto, req: any, files: Array<Express.Multer.File>): Promise<{
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
    getAllPostingWithFilter(semester?: string, minHeight?: string, maxHeight?: string, minWeight?: string, maxWeight?: string): Promise<({
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
    findPostingsByUser(user_id: string): Promise<({
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
    updatePosting(updatePostingDto: UpdatePostingDto, post_id: string, files: Array<Express.Multer.File>, req: any): Promise<{
        user_id: string;
        semester: string | null;
        text: string;
        post_id: string;
        date_created: Date;
    }>;
    deletePosting(post_id: string, req: any): Promise<{
        user_id: string;
        semester: string | null;
        text: string;
        post_id: string;
        date_created: Date;
    }>;
}

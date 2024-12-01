import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findUserProfile(user_id: string): Promise<{
        name: string;
        user_id: string;
        email: string;
        password: string;
        date_joined: Date;
        height: number;
        weight: number;
    }>;
}

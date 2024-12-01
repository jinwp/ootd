import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(createUserDto: CreateUserDto): Promise<{
        name: string;
        user_id: string;
        email: string;
        password: string;
        date_joined: Date;
        height: number;
        weight: number;
    }>;
    login(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: any): Promise<any>;
}

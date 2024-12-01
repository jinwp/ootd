import { Body, Controller, Post, Request, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as process from 'node:process';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.authService.signUp(createUserDto);
    return createdUser;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    console.log("로그인 잘 됨");
    const jwt = await this.authService.login(req.user);
    const userId = req.user.user_id;
    res.setHeader('Authorization', `Bearer ${jwt.access_token}`);
    return res.json({
      access_token: jwt.access_token,
      user_id: userId,
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }
}

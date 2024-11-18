import { Body, Controller, Post, Request, Res, UseGuards } from "@nestjs/common";
import { Response } from 'express';
import { LocalAuthGuard } from "./local-auth.guard";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";

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
    const jwt = await this.authService.login(req.user);
    res.setHeader('Authorization', `Bearer ${jwt.access_token}`);
    return res.json(jwt);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }
}

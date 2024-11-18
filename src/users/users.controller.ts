import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':user_id')
  findUserProfile(@Param('user_id') user_id: string) {
    return this.usersService.findUser(user_id);
  }
}

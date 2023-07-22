import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '../models';
import { CreateUserDto, LoginDto } from './user.dto';
import { UserService } from './user.service';
import { ApiHeader } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiHeader({ name: 'authorizations', required: false, allowReserved: true })
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async createUser(@Body() _user: CreateUserDto): Promise<User> {
    return await this.userService.registerUser(_user);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Req() req: any): Promise<User> {
    return req.user;
  }

  @Post('login')
  async login(@Body() _login: LoginDto): Promise<User> {
    return await this.userService.login(_login);
  }
}

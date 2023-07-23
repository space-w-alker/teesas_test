import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, LoginDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { ApiHeader } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { User } from './user.model';
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
  async getUser(@Req() req: Request & { user: User }): Promise<User> {
    return req.user;
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateUser(
    @Req() req: Request & { user: User },
    @Body() userDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(userDto, req.user.username);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteUser(@Req() req: Request & { user: User }): Promise<number> {
    return this.userService.deleteUser(req.user.username);
  }

  @Post('login')
  async login(@Body() _login: LoginDto): Promise<User> {
    return await this.userService.login(_login);
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../models';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto, LoginDto } from './user.dto';

const JWT_SECRET = 'json_web_token_secret';

@Injectable()
export class UserService {
  users: User[] = [];

  async insertUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async updateUser(user: User): Promise<User> {
    const idx = this.users.findIndex((u) => u.username === user.username);
    if (idx === -1) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    this.users[idx] = user;
    return user;
  }

  async findAllUserByUsername(username: string): Promise<User> {
    const idx = this.users.findIndex((u) => u.username === username);
    if (idx === -1) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return this.users[idx];
  }

  async findAllUsers(): Promise<User[]> {
    return this.users;
  }

  async registerUser(user: CreateUserDto): Promise<User & { token: string }> {
    let exists = false;
    try {
      await this.findAllUserByUsername(user.username);
      exists = true;
    } catch (error) {}
    if (exists)
      throw new HttpException('User Already Exists', HttpStatus.BAD_REQUEST);
    const hashPassword = await bcrypt.hash(user.password, 10);
    const token = jwt.sign({ ...user, password: undefined }, JWT_SECRET);
    const u = await this.insertUser({
      ...user,
      password: hashPassword,
    });
    return { ...u, token };
  }

  async login(login: LoginDto): Promise<User & { token: string }> {
    const user = await this.findAllUserByUsername(login.username);
    const isPasswordCorrect = await bcrypt.compare(
      login.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Authentication Failed: Incorrect Password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = jwt.sign({ ...user, password: undefined }, JWT_SECRET);
    return { ...user, token };
  }

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as User;
  }
}

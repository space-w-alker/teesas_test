import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto, DepositDto, LoginDto, UpdateUserDto } from './user.dto';
import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { INCORRECT_PASSWORD, USER_EXISTS } from '../constants/exceptions';

const JWT_SECRET = 'json_web_token_secret';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}
  async registerUser(user: CreateUserDto): Promise<User & { token: string }> {
    try {
      const hashPassword = await bcrypt.hash(user.password, 10);
      const token = jwt.sign({ ...user, password: undefined }, JWT_SECRET);
      await this.repo.insert({ ...user, password: hashPassword });
      return {
        ...(await this.findByUsername(user.username)),
        token,
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw USER_EXISTS;
      }
      throw error;
    }
  }

  async login(login: LoginDto): Promise<User & { token: string }> {
    const password = await this.getUserPassword(login.username);
    const user = await this.findByUsername(login.username);
    const isPasswordCorrect = await bcrypt.compare(login.password, password);
    if (!isPasswordCorrect) {
      throw INCORRECT_PASSWORD;
    }
    const token = jwt.sign({ ...user, password: undefined }, JWT_SECRET);
    return { ...user, token };
  }

  async findByUsername(username: string) {
    const user = await this.repo.findOneByOrFail({ username });
    delete user.password;
    return user;
  }

  async getUserPassword(username: string) {
    const user = await this.repo.findOneByOrFail({ username });
    return user.password;
  }

  async updateUser(user: UpdateUserDto) {
    this.repo.update({ username: user.username }, user);
  }

  async deposit(depositDto: DepositDto, username: string) {
    await this.repo.increment({ username }, 'deposit', depositDto.amount);
    return this.findByUsername(username);
  }

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as User;
  }
}

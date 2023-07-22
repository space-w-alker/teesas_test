import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto, DepositDto, LoginDto, UpdateUserDto } from './user.dto';
import { Session, User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INCORRECT_PASSWORD, USER_EXISTS } from '../constants/exceptions';

const JWT_SECRET = 'json_web_token_secret';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}
  async registerUser(user: CreateUserDto): Promise<User> {
    if (await this.repo.exist({ where: { username: user.username } })) {
      throw USER_EXISTS;
    }
    const hashPassword = await bcrypt.hash(user.password, 10);
    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: '1H',
    });
    await this.repo.save({
      ...user,
      deposit: 0,
      password: hashPassword,
      sessions: [{ token }],
    });
    const _user = await this.findByUsername(user.username);
    _user.token = token;
    return _user;
  }

  async login(login: LoginDto): Promise<User> {
    await this.clearInactiveSessions(login.username);
    const password = await this.getUserPassword(login.username);
    const user = await this.findByUsername(login.username);
    const isPasswordCorrect = await bcrypt.compare(login.password, password);
    if (!isPasswordCorrect) {
      throw INCORRECT_PASSWORD;
    }
    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: '1H',
    });
    user.sessions.push({ token: token });
    user.warning =
      user.sessions.length > 0 &&
      'There is already an active session using your account';
    return await this.repo.save(user);
  }

  async findByUsername(username: string) {
    const user = await this.repo.findOneByOrFail({ username });
    return user;
  }

  async getUserPassword(username: string) {
    const user = await this.repo.findOneByOrFail({ username });
    return user.password;
  }

  async updateUser(user: UpdateUserDto, username: string) {
    this.repo.update({ username: username }, user);
  }

  async deposit(depositDto: DepositDto, username: string) {
    console.log(await this.findByUsername(username));
    await this.repo.increment({ username }, 'deposit', depositDto.amount);
    return this.findByUsername(username);
  }

  async reset(username: string) {
    await this.repo.update({ username }, { deposit: 0 });
    return this.findByUsername(username);
  }

  async clearInactiveSessions(username: string) {
    const sessions = await this.sessionRepo.find({
      where: { user: { username } },
    });
    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i];
      try {
        this.verifyToken(session.token);
      } catch (error) {
        await this.sessionRepo.delete({ token: session.token });
      }
    }
  }

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as User;
  }
}

export class Convert {
  public static toUser(json: any): User {
    return json;
  }

  public static userToJson(value: User): string {
    return JSON.stringify(value);
  }
}

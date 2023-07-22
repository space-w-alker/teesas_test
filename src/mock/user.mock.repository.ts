import { UpdateResult } from 'typeorm';
import { Role, User } from '../user/user.model';

const users: User[] = [
  {
    role: Role.BUYER,
    deposit: 300,
    password: '1234',
    username: 'user1',
    products: [],
    sessions: [],
  },
  {
    role: Role.SELLER,
    deposit: 200,
    password: '1234',
    username: 'user2',
    products: [],
    sessions: [],
  },
];

export class UserMockRepository {
  async find(): Promise<User[]> {
    return users;
  }
  async findOneByOrFail(): Promise<User> {
    return users[0];
  }
  async save(entity: any): Promise<any[]> {
    return entity;
  }
  async softDelete(): Promise<UpdateResult> {
    return {} as any;
  }
  async update() {
    return;
  }

  async increment(user: any, field: string, value: number) {
    users.find((v) => v.username === user.username)[`${field}`] += value;
    return;
  }
}

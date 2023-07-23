import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMockRepository as MockRepository } from '../src/mock/mock.repository';
import { Product } from '../src/product/product.model';
import { User } from '../src/user/user.model';
import { AuthGuard } from '../src/auth/auth.guard';
import { MockAuthGuard } from '../src/mock/mock.auth.guard';
import { MOCK_PRODUCTS, MOCK_USERS } from '../src/constants/mock.data';
import { Reflector } from '@nestjs/core';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(new MockRepository(MOCK_USERS, 'username'))
      .overrideProvider(getRepositoryToken(Product))
      .useValue(new MockRepository(MOCK_PRODUCTS, 'id'))
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    await app.init();
    server = app.getHttpServer();
  });

  afterEach(async () => {
    await app.close();
    server.close();
  });

  it('/buy (POST)', async () => {
    await request(server)
      .post('/buy')
      .send({ productId: '53b816e5-3763-4139-9581-fe12f53a8cfc', amount: 50 })
      .expect(201, {
        totalSpent: 50,
        productPurchased: '10 x Super product 1',
        change: [
          { count: 2, value: 100 },
          { count: 1, value: 50 },
        ],
      });
  });

  it('/deposit (POST)', async () => {
    await request(server)
      .post('/deposit')
      .send({ amount: 30 })
      .expect(400, {
        message: ['Value is not a valid denomination. 100,50,20,10,5'],
        error: 'Bad Request',
        statusCode: 400,
      });
    await request(server).post('/deposit').send({ amount: 50 }).expect(201, {
      role: 'buyer',
      deposit: 50,
      password: '1234',
      username: 'user1',
      products: [],
      sessions: [],
    });
  });
});

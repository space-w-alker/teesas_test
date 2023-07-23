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
      .useValue(new MockRepository(MOCK_PRODUCTS, 'id', true))
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

  it('/product (POST)', async () => {
    await request(server)
      .post('/product')
      .send({
        productName: 'Super Product',
        amountAvailable: 10,
        cost: 5,
      })
      .expect(201);
  });

  it('/product (PUT)', async () => {
    await request(server)
      .put('/product')
      .send({
        id: '53b816e5-3763-4139-9581-fe12f53a8cfc',
        productName: 'Elite Product',
        amountAvailable: 10,
        cost: 5,
      })
      .expect(200, {
        amountAvailable: 10,
        id: '53b816e5-3763-4139-9581-fe12f53a8cfc',
        cost: 5,
        productName: 'Elite Product',
        seller: {
          role: 'buyer',
          deposit: 300,
          password: '1234',
          username: 'user1',
          products: [],
          sessions: [],
        },
      });
  });

  it('/product (GET)', async () => {
    await request(server).get('/product').expect(200);
  });

  it('/product (GET/:id)', async () => {
    await request(server)
      .get('/product/93292e17-7598-4261-bade-1b0f5bfc5563')
      .expect(200, {
        amountAvailable: 4,
        id: '93292e17-7598-4261-bade-1b0f5bfc5563',
        cost: 8,
        productName: 'Super product 2',
      });
  });

  it('/product (DELETE/:id)', async () => {
    await request(server)
      .delete('/product/93292e17-7598-4261-bade-1b0f5bfc5563')
      .expect(200, { rows: 1 });
  });
});

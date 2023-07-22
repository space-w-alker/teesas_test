import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMockRepository } from '../src/mock/user.mock.repository';
import { ProductMockRepository } from '../src/mock/product.mock.repository';
import { Product } from '../src/product/product.model';
import { User } from '../src/user/user.model';
import { AuthGuard } from '../src/auth/auth.guard';
import { MockAuthGuard } from '../src/mock/mock.auth.guard';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(new UserMockRepository())
      .overrideProvider(getRepositoryToken(Product))
      .useValue(new ProductMockRepository())
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
  });

  afterEach(async () => {
    await app.close();
    server.close();
  });

  it('/buy (POST)', async () => {
    return await request(server)
      .post('/buy')
      .send({ productId: '1', amount: 50 })
      .expect(201, {
        totalSpent: 250,
        productPurchased: '50 * Super product 1',
        change: [{ count: 1, value: 50 }],
      });
  });

  it('/deposit (POST)', async () => {
    return await request(server)
      .post('/deposit')
      .send({ amount: 30 })
      .expect(201, {
        role: 'buyer',
        deposit: 30,
        password: '1234',
        username: 'user1',
        products: [],
        sessions: [],
      });
  });
});

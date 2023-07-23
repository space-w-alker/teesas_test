import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../src/product/product.model';
import { Session, User } from '../src/user/user.model';
import { AuthGuard } from '../src/auth/auth.guard';
import { MockAuthGuard } from '../src/mock/mock.auth.guard';
import { testDatasetSeed } from '../src/constants/mock.data';
import { Reflector } from '@nestjs/core';
import { UserModule } from '../src/user/user.module';
import { AuthModule } from '../src/auth/auth.module';
import { ProductModule } from '../src/product/product.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { UserService } from '../src/user/user.service';
import { ProductService } from '../src/product/product.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let userService: UserService;
  let productService: ProductService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        AuthModule,
        ProductModule,
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          dropSchema: true,
          entities: [Session, User, Product],
          synchronize: true,
          autoLoadEntities: true,
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();
    userService = moduleFixture.get<UserService>(UserService);
    productService = moduleFixture.get<ProductService>(ProductService);
    await testDatasetSeed(userService, productService);
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

  it('/deposit (POST)', async () => {
    await request(server)
      .post('/deposit')
      .auth('buyer1', { type: 'bearer' })
      .send({ amount: 30 })
      .expect(400, {
        message: ['Value is not a valid denomination. 100,50,20,10,5'],
        error: 'Bad Request',
        statusCode: 400,
      });
    await request(server)
      .post('/deposit')
      .auth('buyer1', { type: 'bearer' })
      .send({ amount: 100 })
      .expect(201);
  });

  it('/buy (POST)', async () => {
    const res = await request(server)
      .post('/deposit')
      .auth('buyer1', { type: 'bearer' })
      .send({ amount: 100 })
      .expect(201);
    expect(res.body.deposit).toBe(100);
    const prod = await productService.findAll();
    await request(server)
      .post('/buy')
      .auth('buyer1', { type: 'bearer' })
      .send({ productId: prod[0].id, amount: 50 })
      .expect(201, {
        totalSpent: 50,
        productPurchased: '10 x Super product 1',
        change: [{ count: 1, value: 50 }],
      });
  });
});

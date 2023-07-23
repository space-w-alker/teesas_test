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
import { UserService } from '../src/user/user.service';
import { ProductService } from '../src/product/product.service';
import { UserModule } from '../src/user/user.module';
import { AuthModule } from '../src/auth/auth.module';
import { ProductModule } from '../src/product/product.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

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

  it('/product (POST)', async () => {
    expect((await productService.findAll()).length).toBe(2);
    await request(server)
      .post('/product')
      .auth('seller1', { type: 'bearer' })
      .send({
        productName: 'Super Product',
        amountAvailable: 10,
        cost: 5,
      })
      .expect(201);
    expect((await productService.findAll()).length).toBe(3);
  });

  it('/product (PUT)', async () => {
    const products = await productService.findAll();
    await request(server)
      .put('/product')
      .auth('seller1', { type: 'bearer' })
      .send({
        id: products[0].id,
        productName: 'Elite Product',
        amountAvailable: 10,
        cost: 5,
      })
      .expect(200);
    expect((await productService.findAll())[0].productName).toBe(
      'Elite Product',
    );
  });

  it('/product (GET)', async () => {
    const res = await request(server).get('/product').expect(200);
    expect(res.body[0].amountAvailable).toBe(10);
  });

  it('/product (GET/:id)', async () => {
    const products = await productService.findAll();
    const res = await request(server)
      .get(`/product/${products[0].id}`)
      .expect(200);
    expect(res.body.amountAvailable).toBe(10);
  });

  it('/product (DELETE/:id)', async () => {
    const products = await productService.findAll();
    await request(server)
      .delete(`/product/${products[0].id}`)
      .auth('seller1', { type: 'bearer' })
      .expect(200, { rows: 1 });
  });
});

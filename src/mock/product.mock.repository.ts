import { UpdateResult } from 'typeorm';
import { Product } from '../product/product.model';

const products: Product[] = [
  { amountAvailable: 10, id: 'id1', cost: 5, productName: 'Super product 1' },
  { amountAvailable: 4, id: 'id2', cost: 8, productName: 'Super product 2' },
];

export class ProductMockRepository {
  async find(): Promise<Product[]> {
    return products;
  }
  async findOneByOrFail(): Promise<Product> {
    return products[0];
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

  async increment() {
    return;
  }
}

import { Injectable } from '@nestjs/common';
import { Product } from './product.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { UserService } from '../user/user.service';
import { DENOMINATION } from '../constants/denomination';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    private readonly userService: UserService,
  ) {}

  async createProduct(productDto: CreateProductDto, sellerId: string) {
    const user = await this.userService.findByUsername(sellerId);
    return await this.repo.save({ ...productDto, seller: user });
  }

  async updateProduct(updateDto: UpdateProductDto, sellerId: string) {
    const user = await this.userService.findByUsername(sellerId);
    this.repo.save({ ...updateDto, seller: user });
  }

  async deleteProduct(productId: string) {
    const res = await this.repo.softDelete({ id: productId });
    return res.affected;
  }

  async findProductById(id: string) {
    return await this.repo.findOneByOrFail({ id });
  }

  async findAll() {
    return await this.repo.find();
  }

  async buyProduct(productId: string, amount: number, username: string) {
    const product = await this.repo.findOneByOrFail({ id: productId });
    const user = await this.userService.findByUsername(username);
    const actualAmount = Math.min(
      Math.floor(user.deposit / product.cost),
      amount,
    );
    const totalCost = actualAmount * product.cost;
    user.deposit -= totalCost;
    product.amountAvailable -= actualAmount;
    const change: ChangeUnit[] = [];
    user.deposit = this.evaluateChange(user.deposit, change);
    await this.repo.save(product);
    await this.userService.updateUser(user);
    return {
      totalSpent: totalCost,
      productPurchased: `${actualAmount} * ${product.productName}`,
      change: change.filter((ch) => ch.count > 0),
    };
  }

  private evaluateChange(amount: number, change: ChangeUnit[]) {
    let amountLeft = amount;
    for (let i = 0; i < DENOMINATION.length; i++) {
      const note = DENOMINATION[i];
      const item: (typeof change)[number] = {
        count: Math.floor(amountLeft / note),
        value: note,
      };
      amountLeft -= item.count * item.value;
      change.push(item);
    }
    return amountLeft;
  }
}

export class ChangeUnit {
  value: number;
  count: number;
}

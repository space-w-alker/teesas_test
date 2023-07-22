import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { User } from './user/user.model';
import { UserService } from './user/user.service';
import { DepositDto } from './user/user.dto';
import { BuyProductDto } from './product/product.dto';
import { ProductService } from './product/product.service';
import { ApiHeader } from '@nestjs/swagger';

@ApiHeader({ name: 'authorizations' })
@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  @Post('deposit')
  @UseGuards(AuthGuard)
  async deposit(
    @Req() req: Request & { user: User },
    @Body() deposit: DepositDto,
  ): Promise<User> {
    return this.userService.deposit(deposit, req.user.username);
  }

  @Post('buy')
  @UseGuards(AuthGuard)
  async buy(
    @Req() req: Request & { user: User },
    @Body() buyDto: BuyProductDto,
  ) {
    return this.productService.buyProduct(
      buyDto.productId,
      buyDto.amount,
      req.user.username,
    );
  }
}

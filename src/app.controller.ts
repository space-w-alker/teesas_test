import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { Role, User } from './user/user.model';
import { UserService } from './user/user.service';
import { DepositDto } from './user/user.dto';
import { BuyProductDto } from './product/product.dto';
import { ProductService } from './product/product.service';
import { ApiHeader } from '@nestjs/swagger';
import { Roles } from './decorators';

@ApiHeader({ name: 'authorizations' })
@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  @Post('deposit')
  @UseGuards(AuthGuard)
  @Roles(Role.BUYER)
  async deposit(
    @Req() req: Request & { user: User },
    @Body() deposit: DepositDto,
  ): Promise<User> {
    return this.userService.deposit(deposit, req.user.username);
  }

  @Post('buy')
  @UseGuards(AuthGuard)
  @Roles(Role.BUYER)
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

  @Get('reset')
  @UseGuards(AuthGuard)
  @Roles(Role.BUYER)
  async reset(@Req() req: Request & { user: User }) {
    return this.userService.reset(req.user.username);
  }

  @Get('logout/all')
  @UseGuards(AuthGuard)
  async logoutAll(@Req() req: Request & { user: User }) {
    await this.userService.deleteAllSessions(req.user.username);
    return { message: 'Logged out of all accounts' };
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductService } from './product.service';
import { Role, User } from '../user/user.model';
import { AuthGuard } from '../auth/auth.guard';
import { ApiHeader } from '@nestjs/swagger';
import { Roles } from '../decorators';
@ApiHeader({ name: 'authorizations' })
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  @Roles(Role.SELLER)
  async createProduct(
    @Body() productDto: CreateProductDto,
    @Req() request: Request & { user: User },
  ) {
    return await this.productService.createProduct(
      productDto,
      request.user.username,
    );
  }

  @UseGuards(AuthGuard)
  @Put()
  @Roles(Role.SELLER)
  async updateProduct(
    @Body() productDto: UpdateProductDto,
    @Req() request: Request & { user: User },
  ) {
    return await this.productService.updateProduct(
      productDto,
      request.user.username,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @Roles(Role.SELLER)
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return await this.productService.findProductById(id);
  }

  @Get()
  async getProducts() {
    return await this.productService.findAll();
  }
}

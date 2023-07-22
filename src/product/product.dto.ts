import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  amountAvailable: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  cost: number;
}

export class UpdateProductDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  amountAvailable: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  cost: number;
}

export class DeleteProductDto {
  @ApiProperty()
  @IsString()
  id: string;
}

export class BuyProductDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsPositive()
  amount: number;
}

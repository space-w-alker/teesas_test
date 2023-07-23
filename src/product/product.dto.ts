import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

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
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  productName?: string;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsOptional()
  amountAvailable?: number;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsOptional()
  cost?: number;
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

import { IsEnum, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './user.model';
import { IsInArray } from '../decorators';
import { DENOMINATION } from '../constants/denomination';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ enumName: 'Role', enum: Role })
  @IsEnum(Role)
  role: Role;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ enumName: 'Role', enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role: Role;
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class DepositDto {
  @ApiProperty()
  @IsPositive()
  @IsInArray(DENOMINATION, {
    message: `Value is not a valid denomination. ${DENOMINATION.join(',')}`,
  })
  amount: number;
}

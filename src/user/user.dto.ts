import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Role } from '../models';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNumber()
  deposit: number;

  @ApiProperty({ enumName: 'Role', enum: Role })
  @IsEnum(Role)
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

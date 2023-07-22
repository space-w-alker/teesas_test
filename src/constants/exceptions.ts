import { HttpException, HttpStatus } from '@nestjs/common';

export const USER_EXISTS = new HttpException(
  'Authentication Error: User already exists',
  HttpStatus.BAD_REQUEST,
);
export const INCORRECT_PASSWORD = new HttpException(
  'Authentication Failed: Incorrect Password',
  HttpStatus.BAD_REQUEST,
);

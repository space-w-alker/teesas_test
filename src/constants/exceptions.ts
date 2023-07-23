import { HttpException, HttpStatus } from '@nestjs/common';

export const USER_EXISTS = new HttpException(
  'Authentication Error: User already exists',
  HttpStatus.BAD_REQUEST,
);

export const USER_NOT_EXISTS = new HttpException(
  'Error: User does not exist. Please create an account',
  HttpStatus.BAD_REQUEST,
);

export const INCORRECT_PASSWORD = new HttpException(
  'Authentication Failed: Incorrect Password',
  HttpStatus.BAD_REQUEST,
);

export const SESSION_TERMINATED = new HttpException(
  'Session Terminated: Authenticate to continue',
  HttpStatus.UNAUTHORIZED,
);

export const INVALID_TOKEN = new HttpException(
  'Invalid Token: Authenticate to continue',
  HttpStatus.UNAUTHORIZED,
);

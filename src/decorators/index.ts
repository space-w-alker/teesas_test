import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  IsStrongPassword,
} from 'class-validator';
import { SetMetadata } from '@nestjs/common';
import { Role } from '../user/user.model';

export function IsInArray(
  property: number[],
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isInArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: property,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints;
          return typeof value === 'number' && constraints.includes(value);
        },
      },
    });
  };
}

export function IsGreaterThan(
  property: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [constraints] = args.constraints;
          return typeof value === 'number' && value > constraints;
        },
      },
    });
  };
}

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

export const StrongPassword = () =>
  IsStrongPassword(
    {
      minLength: 4,
      minLowercase: 0,
      minNumbers: 0,
      minSymbols: 0,
      minUppercase: 0,
    },
    { message: 'Password must be at least 4 characters long' },
  );

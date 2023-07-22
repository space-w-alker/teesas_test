import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
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

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

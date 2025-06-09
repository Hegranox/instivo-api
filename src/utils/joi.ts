import { BadRequestException } from '@nestjs/common';
import { ObjectSchema, ValidationError } from 'joi';
import { getClassSchema } from 'joi-class-decorators';

export function validateWithJoi<T>(dtoClass: new () => T, data: unknown): T {
  const schema = getClassSchema(dtoClass) as ObjectSchema;

  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  }) as { error: ValidationError; value: T };

  if (error) {
    throw new BadRequestException({
      message: error.message,
    });
  }

  return value;
}

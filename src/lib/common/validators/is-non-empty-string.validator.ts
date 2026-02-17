import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsNonSpacesString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNonSpacesString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^[^\s]+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} no puede contener espacios`;
        },
      },
    });
  };
}

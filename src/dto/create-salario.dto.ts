import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

@JoiSchemaOptions({ allowUnknown: false })
export class CreateSalarioDto {
  @ApiProperty({
    description: 'Data de admissão do funcionário',
    example: '2025-01-01',
  })
  @JoiSchema(
    Joi.date().max('now').required().messages({
      'date.required': 'Data de admissão é obrigatória',
      'date.base': 'Data de admissão deve ser uma data válida',
      'date.max': 'Data de admissão não pode ser maior que a data atual',
    }),
  )
  dataAdmissao: Date;

  @ApiProperty({
    description: 'Salário bruto do funcionário',
    example: 2000,
  })
  @JoiSchema(
    Joi.number().min(1518).max(30000).required().messages({
      'number.required': 'Salário bruto é obrigatório',
      'number.base': 'Salário bruto deve ser um número válido',
      'number.min': 'Salário bruto não pode ser menor que R$ 1518,00',
      'number.max': 'Salário bruto não pode ser maior que R$ 30000,00',
    }),
  )
  salarioBruto: number;
}

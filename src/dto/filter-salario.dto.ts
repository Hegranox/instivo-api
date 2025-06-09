import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';

@JoiSchemaOptions({ allowUnknown: false })
export class FilterSalarioDto {
  @ApiProperty({
    description: 'Data de admissão do funcionário',
    example: '2025-01-01',
  })
  @JoiSchema(
    Joi.date()
      .optional()
      .when('dataAdmissaoFim', {
        is: Joi.date().valid(),
        then: Joi.date().max(Joi.ref('dataAdmissaoFim')),
        otherwise: Joi.date(),
      })
      .messages({
        'date.base': 'Data de admissão deve ser uma data válida',
        'date.max':
          'Data de admissão inicial não pode ser maior que a data de admissão final',
      }),
  )
  dataAdmissaoInicio?: Date;

  @ApiProperty({
    description: 'Data de admissão do funcionário',
    example: '2025-01-01',
  })
  @JoiSchema(
    Joi.date().optional().messages({
      'date.base': 'Data de admissão deve ser uma data válida',
    }),
  )
  dataAdmissaoFim?: Date;

  @ApiProperty({
    description: 'Salário bruto do funcionário',
    example: 2000,
  })
  @JoiSchema(
    Joi.number()
      .optional()
      .when('salarioBrutoFim', {
        is: Joi.number().greater(0),
        then: Joi.number().max(Joi.ref('salarioBrutoFim')),
        otherwise: Joi.number(),
      })
      .messages({
        'number.base': 'Salário bruto deve ser um número válido',
        'number.max':
          'Salário bruto inicial não pode ser maior que o salário bruto final',
      }),
  )
  salarioBrutoInicio?: number;

  @ApiProperty({
    description: 'Salário bruto do funcionário',
    example: 2000,
  })
  @JoiSchema(
    Joi.number().optional().messages({
      'number.base': 'Salário bruto deve ser um número válido',
    }),
  )
  salarioBrutoFim?: number;

  @ApiProperty({
    description: 'Página',
    example: 1,
  })
  @JoiSchema(
    Joi.number().required().min(1).messages({
      'number.base': 'Página deve ser um número válido',
      'number.min': 'Página deve ser maior que 0',
    }),
  )
  page: number;

  @ApiProperty({
    description: 'Limite',
    example: 10,
  })
  @JoiSchema(
    Joi.number().required().min(1).messages({
      'number.base': 'Limite deve ser um número válido',
      'number.min': 'Limite deve ser maior que 0',
    }),
  )
  limit: number;
}

import { ApiProperty } from '@nestjs/swagger';
import Joi, { CustomHelpers } from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ allowUnknown: false })
export class FilterSalarioDto {
  @ApiProperty({
    description: 'Data de admissão do funcionário',
    example: '2025-01-01',
  })
  @JoiSchema(
    Joi.date()
      .optional()
      .custom((value: Date, helpers: CustomHelpers) => {
        const context = helpers.prefs?.context as { dataAdmissaoFim?: string };

        if (context?.dataAdmissaoFim) {
          const inicio = new Date(value);
          const fim = new Date(context.dataAdmissaoFim);

          if (
            !isNaN(inicio.getTime()) &&
            !isNaN(fim.getTime()) &&
            inicio > fim
          ) {
            return helpers.error('date.less', { limit: fim.toISOString() });
          }
        }

        return value;
      })
      .messages({
        'date.base': 'Data de admissão deve ser uma data válida',
        'date.less':
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
      .custom((value: number, helpers: CustomHelpers) => {
        const context = helpers.prefs?.context as { salarioBrutoFim?: number };

        if (context?.salarioBrutoFim) {
          if (value > context.salarioBrutoFim) {
            return helpers.error('number.max', {
              limit: context.salarioBrutoFim,
            });
          }
        }

        return value;
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

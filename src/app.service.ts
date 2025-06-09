import { Injectable } from '@nestjs/common';
import { AppRepository } from './app.repository';
import { CreateSalarioDto } from './dto/create-salario.dto';
import moment from 'moment';
import { ObjectId } from 'mongodb';
import { FilterSalarioDto } from './dto/filter-salario.dto';
import { validateWithJoi } from './utils/joi';

@Injectable()
export class AppService {
  constructor(private readonly appRepository: AppRepository) {}

  async createSalario(createSalarioDto: CreateSalarioDto) {
    validateWithJoi(CreateSalarioDto, createSalarioDto);

    const salarioFuncionario = {
      salarioBruto: createSalarioDto.salarioBruto,
      salarioLiquido: Number((createSalarioDto.salarioBruto * 0.65).toFixed(2)),
      dataAdmissao: createSalarioDto.dataAdmissao,
      diasDecorridosAdmissao: moment().diff(
        moment(createSalarioDto.dataAdmissao),
        'days',
      ),
      mesesDecorridosAdmissao: moment().diff(
        moment(createSalarioDto.dataAdmissao),
        'months',
      ),
      anosDecorridosAdmissao: moment().diff(
        moment(createSalarioDto.dataAdmissao),
        'years',
      ),
    };

    const salario = await this.appRepository.createSalario(salarioFuncionario);

    return {
      id: salario.id,
      dataAdmissao: salarioFuncionario.dataAdmissao,
      salarioBruto: salarioFuncionario.salarioBruto,
      salarioLiquido: salarioFuncionario.salarioLiquido,
      diasDecorridosAdmissao: salarioFuncionario.diasDecorridosAdmissao,
      mesesDecorridosAdmissao: salarioFuncionario.mesesDecorridosAdmissao,
      anosDecorridosAdmissao: salarioFuncionario.anosDecorridosAdmissao,
    };
  }

  async findAllSalarios(filter: FilterSalarioDto) {
    validateWithJoi(FilterSalarioDto, filter);

    return this.appRepository.findAllSalarios(filter);
  }

  async findSalarioById(id: string) {
    return this.appRepository.findSalarioById(new ObjectId(id));
  }
}

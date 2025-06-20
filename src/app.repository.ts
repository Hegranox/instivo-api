import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Repository } from 'typeorm';
import { FilterSalarioDto } from './dto/filter-salario.dto';
import { SalarioFuncionario } from './entities/salario_funcionario.entity';
import moment from 'moment';

type MongoOperators<T> = {
  $gte?: T;
  $lte?: T;
};

@Injectable()
export class AppRepository {
  constructor(
    @InjectRepository(SalarioFuncionario)
    private salarioFuncionarioRepository: Repository<SalarioFuncionario>,
  ) {}

  async createSalario(salarioFuncionario: Omit<SalarioFuncionario, 'id'>) {
    return this.salarioFuncionarioRepository.save(salarioFuncionario);
  }

  async findAllSalarios(filter: FilterSalarioDto) {
    const { page, limit, ...filterData } = filter;

    const where: Record<string, MongoOperators<any>> = {};

    if (filterData.dataAdmissaoInicio || filterData.dataAdmissaoFim) {
      where.dataAdmissao = {};

      if (filterData.dataAdmissaoInicio) {
        where.dataAdmissao.$gte = moment(filterData.dataAdmissaoInicio)
          .utc()
          .startOf('day')
          .toDate();
      }
      if (filterData.dataAdmissaoFim) {
        where.dataAdmissao.$lte = moment(filterData.dataAdmissaoFim)
          .utc()
          .endOf('day')
          .toDate();
      }
    }

    if (filterData.salarioBrutoInicio || filterData.salarioBrutoFim) {
      where.salarioBruto = {};

      if (filterData.salarioBrutoInicio) {
        where.salarioBruto.$gte = filterData.salarioBrutoInicio;
      }
      if (filterData.salarioBrutoFim) {
        where.salarioBruto.$lte = filterData.salarioBrutoFim;
      }
    }

    const [salarios, total] =
      await this.salarioFuncionarioRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        where,
        order: {
          dataAdmissao: 'asc',
        },
      });

    return { salarios, total };
  }

  async findSalarioById(id: ObjectId) {
    return this.salarioFuncionarioRepository.findOne({ where: { id } });
  }
}

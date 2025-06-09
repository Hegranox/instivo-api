import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import moment from 'moment';
import { AppRepository } from './app.repository';
import { AppService } from './app.service';
import { SalarioFuncionario } from './entities/salario_funcionario.entity';

describe('AppService', () => {
  let service: AppService;
  let repository: AppRepository;

  const mockRepository = {
    createSalario: jest.fn().mockResolvedValue({
      id: '1',
    }),
    findAllSalarios: jest.fn().mockResolvedValue({
      salarios: [
        {
          id: '1',
          salarioBruto: 1000,
          salarioLiquido: 1000,
          dataAdmissao: new Date(),
          diasDecorridosAdmissao: 100,
          mesesDecorridosAdmissao: 10,
          anosDecorridosAdmissao: 1,
        },
      ],
      total: 1,
    }),
    findSalarioById: jest.fn().mockResolvedValue({
      id: '1',
      salarioBruto: 1000,
      salarioLiquido: 1000,
      dataAdmissao: new Date(),
      diasDecorridosAdmissao: 100,
      mesesDecorridosAdmissao: 10,
      anosDecorridosAdmissao: 1,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: AppRepository,
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(SalarioFuncionario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    repository = module.get<AppRepository>(AppRepository);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should not create a salario with date admission in the future', async () => {
    await expect(
      service.createSalario({
        salarioBruto: 1000,
        dataAdmissao: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not create a salario with salary less than 1518', async () => {
    await expect(
      service.createSalario({
        salarioBruto: 1000,
        dataAdmissao: new Date(),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not create a salario with salary greater than 30000', async () => {
    await expect(
      service.createSalario({
        salarioBruto: 30001,
        dataAdmissao: new Date(),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not create a salario with invalid dataAdmissao', async () => {
    await expect(
      service.createSalario({
        salarioBruto: 1000,
        dataAdmissao: new Date('invalid-date'),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create a salario with valid data', async () => {
    const salario = await service.createSalario({
      salarioBruto: 8325,
      dataAdmissao: moment().subtract(1, 'year').toDate(),
    });
    expect(salario).toBeDefined();
    expect(salario.salarioLiquido).toBe(5411.25);
    expect(salario.diasDecorridosAdmissao).toBe(365);
    expect(salario.mesesDecorridosAdmissao).toBe(12);
    expect(salario.anosDecorridosAdmissao).toBe(1);
  });

  it('should not find all salarios with invalid filter page', async () => {
    await expect(
      service.findAllSalarios({
        page: 0,
        limit: 10,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not find all salarios with invalid filter limit', async () => {
    await expect(
      service.findAllSalarios({
        page: 1,
        limit: 0,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find all salarios with valid filter', async () => {
    const salarios = await service.findAllSalarios({
      page: 1,
      limit: 10,
    });
    expect(salarios).toBeDefined();
    expect(salarios.salarios).toBeDefined();
    expect(salarios.salarios.length).toBe(1);
    expect(salarios.total).toBe(salarios.salarios.length);
  });

  it('should find salario by id with valid id', async () => {
    const salario = await service.findSalarioById('111111111111111111111111');
    expect(salario).toBeDefined();
  });
});

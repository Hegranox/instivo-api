import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppRepository } from './app.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SalarioFuncionario } from './entities/salario_funcionario.entity';
import moment from 'moment';
import { BadRequestException } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;

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
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
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

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should not create a salario with date admission in the future', async () => {
    await expect(
      appController.createSalario({
        salarioBruto: 1000,
        dataAdmissao: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not create a salario with salary less than 1518', async () => {
    await expect(
      appController.createSalario({
        salarioBruto: 1000,
        dataAdmissao: new Date(),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not create a salario with salary greater than 30000', async () => {
    await expect(
      appController.createSalario({
        salarioBruto: 30001,
        dataAdmissao: new Date(),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not create a salario with invalid dataAdmissao', async () => {
    await expect(
      appController.createSalario({
        salarioBruto: 1000,
        dataAdmissao: new Date('invalid-date'),
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should create a salario with valid data', async () => {
    const salario = await appController.createSalario({
      salarioBruto: 8325,
      dataAdmissao: moment().subtract(1, 'year').toDate(),
    });
    expect(salario).toBeDefined();
  });

  it('should not find all salarios with invalid filter page', async () => {
    await expect(
      appController.findAllSalarios({
        page: 0,
        limit: 10,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not find all salarios with invalid filter limit', async () => {
    await expect(
      appController.findAllSalarios({
        page: 1,
        limit: 0,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should find all salarios with valid filter', async () => {
    const salarios = await appController.findAllSalarios({
      page: 1,
      limit: 10,
    });
    expect(salarios).toBeDefined();
  });

  it('should find all salarios with valid filter dataAdmissaoInicio', async () => {
    const salarios = await appController.findAllSalarios({
      dataAdmissaoInicio: moment().subtract(1, 'year').toDate(),
      page: 1,
      limit: 10,
    });
    expect(salarios).toBeDefined();
  });

  it('should find all salarios with valid filter dataAdmissaoFim', async () => {
    const salarios = await appController.findAllSalarios({
      dataAdmissaoFim: moment().toDate(),
      page: 1,
      limit: 10,
    });
    expect(salarios).toBeDefined();
  });

  it('should find all salarios with valid filter dataAdmissaoInicio and dataAdmissaoFim', async () => {
    const salarios = await appController.findAllSalarios({
      dataAdmissaoInicio: moment().subtract(1, 'year').toDate(),
      dataAdmissaoFim: moment().toDate(),
      page: 1,
      limit: 10,
    });

    expect(salarios.salarios.length).toBeGreaterThan(0);
  });

  it('should find all salarios with valid filter salarioBrutoInicio', async () => {
    const salarios = await appController.findAllSalarios({
      salarioBrutoInicio: 1000,
      page: 1,
      limit: 10,
    });

    expect(salarios.salarios.length).toBeGreaterThan(0);
  });

  it('should find all salarios with valid filter salarioBrutoFim', async () => {
    const salarios = await appController.findAllSalarios({
      salarioBrutoFim: 1000,
      page: 1,
      limit: 10,
    });

    expect(salarios.salarios.length).toBeGreaterThan(0);
  });

  it('should find all salarios with valid filter salarioBrutoInicio and salarioBrutoFim', async () => {
    const salarios = await appController.findAllSalarios({
      salarioBrutoInicio: 1000,
      salarioBrutoFim: 1000,
      page: 1,
      limit: 10,
    });

    expect(salarios.salarios.length).toBeGreaterThan(0);
  });

  it('should find salario by id with valid id', async () => {
    const salario = await appController.findSalarioById(
      '111111111111111111111111',
    );
    expect(salario).toBeDefined();
  });
});

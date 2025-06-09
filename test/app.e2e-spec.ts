import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import {
  createTestRecords,
  setupTestDb,
  tearDownTestDb,
} from './setup-mongo-test';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import moment from 'moment';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    await setupTestDb();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await createTestRecords(app);
  });

  afterAll(async () => {
    await app.close();
    tearDownTestDb();
  });

  it('/ (GET) Shoud find all salarios', async () => {
    const response = await request(app.getHttpServer()).get(
      '/registros?page=1&limit=10',
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(
      (response.body as { salarios: any[]; total: number }).salarios.length,
    ).toBe(10);
    expect((response.body as { salarios: any[]; total: number }).total).toBe(
      25,
    );
  });

  it('/ (GET) Shoud find all salarios with filter', async () => {
    const response = await request(app.getHttpServer()).get(
      '/registros?page=1&limit=10&dataAdmissaoInicio=2024-01-01&dataAdmissaoFim=2025-12-31&salarioBrutoInicio=2000&salarioBrutoFim=3500',
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(
      (response.body as { salarios: any[]; total: number }).salarios.length,
    ).toBe(3);
    expect((response.body as { salarios: any[]; total: number }).total).toBe(3);
  });

  it('/ (GET) Shoud find salario by id', async () => {
    const response = await request(app.getHttpServer()).get(
      '/registros?page=1&limit=1',
    );

    const salarioId = (
      response.body as {
        salarios: Array<{
          id: string;
        }>;
      }
    ).salarios[0].id;

    const salarioResponse = await request(app.getHttpServer()).get(
      `/registros/${salarioId}`,
    );

    expect(salarioResponse.status).toBe(200);
    expect(salarioResponse.body).toBeDefined();
  });

  it('/ (POST) Shoud not create a salario with salary less than 1518', async () => {
    const response = await request(app.getHttpServer()).post('/').send({
      salarioBruto: 1000,
      dataAdmissao: new Date(),
    });
    expect(response.status).toBe(400);
  });

  it('/ (POST) Shoud not create a salario with dataAdmissao in the future', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .send({
        salarioBruto: 1519,
        dataAdmissao: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      });
    expect(response.status).toBe(400);
  });

  it('/ (POST) Shoud create a salario with salary greater than 1518 and dataAdmissao in the past', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .send({
        salarioBruto: 8325,
        dataAdmissao: moment().subtract(1, 'year').toDate(),
      });

    const salario = response.body as {
      salarioLiquido: number;
      diasDecorridosAdmissao: number;
      mesesDecorridosAdmissao: number;
      anosDecorridosAdmissao: number;
    };

    expect(response.status).toBe(201);
    expect(salario.salarioLiquido).toBe(5411.25);
    expect(salario.diasDecorridosAdmissao).toBe(365);
    expect(salario.mesesDecorridosAdmissao).toBe(12);
    expect(salario.anosDecorridosAdmissao).toBe(1);
  });
});

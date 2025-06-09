import { INestApplication } from '@nestjs/common';
import { execSync } from 'child_process';
import moment from 'moment';
import { App } from 'supertest/types';
import request from 'supertest';

export async function setupTestDb() {
  console.log('🟢 Starting test database in Docker...');
  execSync(`docker-compose -f docker-compose.test.yml up -d`, {
    stdio: 'inherit',
  });

  console.log('⏳ Waiting for MongoDB to be ready...');
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

export function tearDownTestDb() {
  console.log('🛑 Stopping test database...');
  execSync(`docker-compose -f docker-compose.test.yml down`, {
    stdio: 'inherit',
  });
}

export async function createTestRecords(app: INestApplication<App>) {
  for (let i = 1; i <= 25; i++) {
    await request(app.getHttpServer())
      .post('/')
      .send({
        salarioBruto: Math.min(Math.max(1600, 2000 + i * 500), 30000),
        dataAdmissao: moment().subtract(i, 'months').toDate(),
      });
  }
}

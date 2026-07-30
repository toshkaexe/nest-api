import { INestApplication } from '@nestjs/common';
import request from 'supertest';

const AUTH_CREDENTIALS = Buffer.from('admin:qwerty').toString('base64');

export interface CreateUserInput {
  login: string;
  password: string;
  email: string;
}

export const defaultUser: CreateUserInput = {
  login: 'testuser',
  password: 'qwerty1',
  email: 'test@gmail.com',
};

export async function createUser(
  app: INestApplication,
  input: CreateUserInput = defaultUser,
) {
  const response = await request(app.getHttpServer())
    .post('/users')
    .set('Authorization', `Basic ${AUTH_CREDENTIALS}`)
    .send(input)
    .expect(201);

  return response.body;
}

export async function createAndLoginUser(
  app: INestApplication,
  input: CreateUserInput = defaultUser,
) {
  await createUser(app, input);

  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ loginOrEmail: input.login, password: input.password })
    .expect(200);

  return {
    accessToken: loginResponse.body.accessToken,
    user: input,
  };
}

export async function deleteAllData(app: INestApplication) {
  await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
}

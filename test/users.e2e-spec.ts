import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './helpers/test-setup';
import { createUser, defaultUser, deleteAllData } from './helpers/users-helper';

const AUTH_CREDENTIALS = Buffer.from('admin:qwerty').toString('base64');

describe('Users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('CRUD operations', () => {
    beforeAll(async () => {
      await deleteAllData(app);
    });

    it('POST /users - should create new user; status 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Basic ${AUTH_CREDENTIALS}`)
        .send(defaultUser)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          login: defaultUser.login,
          email: defaultUser.email,
          createdAt: expect.any(String),
        }),
      );
    });

    it('GET /users - should return users with pagination; status 200', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Basic ${AUTH_CREDENTIALS}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          items: expect.any(Array),
          totalCount: expect.any(Number),
          pagesCount: expect.any(Number),
          page: expect.any(Number),
          pageSize: expect.any(Number),
        }),
      );
      expect(response.body.items.length).toBeGreaterThan(0);
    });

    it('DELETE /users/:id - should delete user; status 204', async () => {
      const user = await createUser(app, {
        login: 'todelete',
        password: 'qwerty1',
        email: 'del@gmail.com',
      });

      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', `Basic ${AUTH_CREDENTIALS}`)
        .expect(204);
    });

    it('DELETE /users/:id - should return 404 if user not found', async () => {
      await request(app.getHttpServer())
        .delete('/users/64b5f0a1c5e1a12345678901')
        .set('Authorization', `Basic ${AUTH_CREDENTIALS}`)
        .expect(404);
    });
  });

  describe('Authorization', () => {
    it('POST /users - should return 401 without auth', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(defaultUser)
        .expect(401);
    });

    it('POST /users - should return 401 with wrong credentials', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .set(
          'Authorization',
          `Basic ${Buffer.from('wrong:wrong').toString('base64')}`,
        )
        .send(defaultUser)
        .expect(401);
    });

    it('DELETE /users/:id - should return 401 without auth', async () => {
      await request(app.getHttpServer())
        .delete('/users/64b5f0a1c5e1a12345678901')
        .expect(401);
    });
  });

  describe('Body validation', () => {
    it('POST /users - should return 400 if body is incorrect', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Basic ${AUTH_CREDENTIALS}`)
        .send({ login: 'sh', password: 'length_21-weqweqweqwq', email: 'bad' })
        .expect(400);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'login' }),
          expect.objectContaining({ field: 'password' }),
          expect.objectContaining({ field: 'email' }),
        ]),
      );
    });
  });
});

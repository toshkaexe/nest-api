import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, EmailServiceMock } from './helpers/test-setup';
import {
  createUser,
  createAndLoginUser,
  deleteAllData,
} from './helpers/users-helper';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Login', () => {
    beforeAll(async () => {
      await deleteAllData(app);
      await createUser(app, {
        login: 'loginuser',
        password: 'qwerty1',
        email: 'login@gmail.com',
      });
    });

    it('POST /auth/login - should sign in user; status 200', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: 'loginuser', password: 'qwerty1' })
        .expect(200);

      expect(response.body).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('POST /auth/login - should return 401 with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: 'loginuser', password: 'wrongpass' })
        .expect(401);
    });

    it('POST /auth/login - should return 401 with non-existing user', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: 'nouser', password: 'qwerty1' })
        .expect(401);
    });
  });

  describe('Me', () => {
    let accessToken: string;

    beforeAll(async () => {
      await deleteAllData(app);
      const result = await createAndLoginUser(app, {
        login: 'meuser',
        password: 'qwerty1',
        email: 'me@gmail.com',
      });
      accessToken = result.accessToken;
    });

    it('GET /auth/me - should return current user info; status 200', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual({
        email: 'me@gmail.com',
        login: 'meuser',
        userId: expect.any(String),
      });
    });

    it('GET /auth/me - should return 401 without token', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });

  describe('Registration', () => {
    beforeAll(async () => {
      await deleteAllData(app);
      EmailServiceMock.sendRegistrationConfirmationLink.mockClear();
    });

    it('POST /auth/registration - should register user; status 204', async () => {
      await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          login: 'newuser',
          password: 'qwerty1',
          email: 'new@gmail.com',
        })
        .expect(204);

      expect(
        EmailServiceMock.sendRegistrationConfirmationLink,
      ).toHaveBeenCalledWith('new@gmail.com', expect.any(String));
    });

    it('POST /auth/registration - should return 400 if login already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          login: 'newuser',
          password: 'qwerty1',
          email: 'another@gmail.com',
        })
        .expect(400);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'login' }),
        ]),
      );
    });

    it('POST /auth/registration - should return 400 if email already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          login: 'another',
          password: 'qwerty1',
          email: 'new@gmail.com',
        })
        .expect(400);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
        ]),
      );
    });
  });

  describe('Registration confirmation', () => {
    let confirmationCode: string;

    beforeAll(async () => {
      await deleteAllData(app);
      EmailServiceMock.sendRegistrationConfirmationLink.mockClear();

      await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          login: 'confuser',
          password: 'qwerty1',
          email: 'conf@gmail.com',
        })
        .expect(204);

      confirmationCode =
        EmailServiceMock.sendRegistrationConfirmationLink.mock.calls[0][1];
    });

    it('POST /auth/registration-confirmation - should confirm; status 204', async () => {
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({ code: confirmationCode })
        .expect(204);
    });

    it('POST /auth/registration-confirmation - should return 400 if code already used', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({ code: confirmationCode })
        .expect(400);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'code' }),
        ]),
      );
    });

    it('POST /auth/registration-confirmation - should return 400 if code invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({ code: 'invalid-code' })
        .expect(400);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'code' }),
        ]),
      );
    });
  });

  describe('Registration email resending', () => {
    beforeAll(async () => {
      await deleteAllData(app);
      EmailServiceMock.sendRegistrationConfirmationLink.mockClear();

      await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          login: 'resenduser',
          password: 'qwerty1',
          email: 'resend@gmail.com',
        })
        .expect(204);
    });

    it('POST /auth/registration-email-resending - should resend; status 204', async () => {
      EmailServiceMock.sendRegistrationConfirmationLink.mockClear();

      await request(app.getHttpServer())
        .post('/auth/registration-email-resending')
        .send({ email: 'resend@gmail.com' })
        .expect(204);

      expect(
        EmailServiceMock.sendRegistrationConfirmationLink,
      ).toHaveBeenCalledWith('resend@gmail.com', expect.any(String));
    });

    it('POST /auth/registration-email-resending - should return 400 if email not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration-email-resending')
        .send({ email: 'nonexist@gmail.com' })
        .expect(400);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
        ]),
      );
    });

    it('POST /auth/registration-email-resending - should return 400 if already confirmed', async () => {
      const code =
        EmailServiceMock.sendRegistrationConfirmationLink.mock.calls[0][1];

      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({ code })
        .expect(204);

      const response = await request(app.getHttpServer())
        .post('/auth/registration-email-resending')
        .send({ email: 'resend@gmail.com' })
        .expect(400);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email' }),
        ]),
      );
    });
  });

  describe('Registration body validation', () => {
    it('POST /auth/registration - should return 400 for invalid body', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          login: 'sh',
          password: 'length_21-weqweqweqwq',
          email: 'invalid',
        })
        .expect(400);

      expect(response.body.errorsMessages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'login' }),
          expect.objectContaining({ field: 'password' }),
        ]),
      );
    });
  });
});

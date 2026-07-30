import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from './helpers/test-setup';
import { deleteAllData } from './helpers/users-helper';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Testing endpoint', () => {
    it('DELETE /testing/all-data - should clear database; status 204', async () => {
      await deleteAllData(app);

      const response = await request(app.getHttpServer())
        .get('/users')
        .set(
          'Authorization',
          `Basic ${Buffer.from('admin:qwerty').toString('base64')}`,
        )
        .expect(200);

      expect(response.body.items).toHaveLength(0);
    });
  });
});

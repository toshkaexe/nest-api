import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/settings/apply-app-settings';
import { EmailService } from '../../src/features/adapter/EmailService';

export const EmailServiceMock = {
  sendRecoveryCode: jest.fn().mockResolvedValue(undefined),
  sendRegistrationConfirmationLink: jest.fn().mockResolvedValue(undefined),
  send: jest.fn().mockResolvedValue(undefined),
};

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(EmailService)
    .useValue(EmailServiceMock)
    .compile();

  const app = moduleFixture.createNestApplication();
  applyAppSettings(app);
  await app.init();

  return app;
}

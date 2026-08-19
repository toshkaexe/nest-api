import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppSettings } from './settings/appSettings';
import { applyAppSettings } from './settings/apply-app-settings';
import { Logger } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalInterceptors(new LoggingInterceptor());

  applyAppSettings(app);

  const port = AppSettings.PORT || 3000;
  await app.listen(port, '0.0.0.0', () => {
    logger.log(`App started listening on port: ${port}`);
    logger.log(`Connected to database: ${AppSettings.DB_NANE_NEST}`);
  });
}

bootstrap();

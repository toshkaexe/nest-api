import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppSettings } from './settings/appSettings';
import { applyAppSettings } from './settings/apply-app-settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);

  await app.listen(3000, () => {
    console.log('App starting listening port: ', AppSettings.PORT);

    console.log('EMAIL ', AppSettings.SEND_MAIL_SERVICE_EMAIL);
    // console.log('ENV: ', AppSettings.env.getEnv());
  });
}
bootstrap();

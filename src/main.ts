import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/appSettings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);

  await app.listen(3000, () => {
    console.log('App starting listening port: ', process.env.PORT);

    console.log('EMAIL ', process.env.EMAIL);
    // console.log('ENV: ', AppSettings.env.getEnv());
  });
}
bootstrap();

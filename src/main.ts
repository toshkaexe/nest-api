import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {AppSettings} from './settings/appSettings';
import {applyAppSettings} from './settings/apply-app-settings';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    applyAppSettings(app);

    await app.listen(3000, () => {
        console.log('App starting listening port: ', AppSettings.PORT);

        console.log('Our base: ', AppSettings.DB_NANE_NEST);
    });
}

bootstrap();

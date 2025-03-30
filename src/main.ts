import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {AppSettings} from './settings/appSettings';
import {applyAppSettings} from './settings/apply-app-settings';
import {Logger} from "@nestjs/common";
import {LoggingInterceptor} from "./common/interceptors/logging.interceptor";

async function bootstrap() {
    const logger = new Logger('Bootstrap'); // Create a logger instance
    const app = await NestFactory.create(AppModule);
    app.useGlobalInterceptors(new LoggingInterceptor())

    applyAppSettings(app);

    await app.listen(3000, () => {
        logger.log(`App started listening on port: ${AppSettings.PORT}`);
        logger.log(`Connected to database: ${AppSettings.DB_NANE_NEST}`);
    });
}

bootstrap();

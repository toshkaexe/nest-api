import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import dotenv from 'dotenv';
import process from 'process';
dotenv.config();

export const AppSettings = {
  PORT: process.env.PORT,
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
  ACCESS_JWT_EXPIRES: '5h',
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  REFRESH_JWT_EXPIRES: '10h',
  AUTH_LOGIN: 'admin',
  AUTH_PASSWORD: 'qwerty',
  MONGO_URI: process.env.MONGO_URI_CLOUD,
  MONGO_LOCAL_URI: 'mongo://localhost:27017',
  DB_NAME: 'nest_base',
  SEND_MAIL_SERVICE_EMAIL: 'antonanton2025@internet.ru',
  EMAIL_PWS: 'DMscNJUkP2nJ6f6UZp9b',
  MONGO_URI_CLOUD:
    'mongodb+srv://antonzeltser:admin@cluster0.rmbeaqk.mongodb.net/',
  MONGO_URI_LOCAL: 'mongo://localhost:27017',
};

const APP_PREFIX = '/app';
export const applyAppSettings = (app: INestApplication) => {
  const swaggerPath = APP_PREFIX + '/swagger-doc';

  const config = new DocumentBuilder()
    .setTitle('Blogger Api')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'Blogger Swagger',
  });

  //   /*  app.useGlobalInterceptors(new LoggingInterceptor());
  //   app.use(LoggerMiddlewareFunc);
  //   */
  //   // установка префикса
  //   setPrefix(app);
  // setSwagger(app);
  //   /*   setAppPipes(app);*/
  //   setAppExceptionFilters(app);
  // };
  // const setPrefix = (app: INestApplication) => {
  //   app.setGlobalPrefix(APP_PREFIX);
  // };
  //
  // const setSwagger = (app: INestApplication) => {
  //   // if (true) {
  //   const swaggerPath = APP_PREFIX + '/swagger-doc';
  //
  //   const config = new DocumentBuilder()
  //     .setTitle('Blogger Api')
  //     .addBearerAuth()
  //     .setVersion('1.0')
  //     .build();
  //
  //   const document = SwaggerModule.createDocument(app, config);
  //   SwaggerModule.setup(swaggerPath, app, document, {
  //     customSiteTitle: 'Blogger Swagger',
  //   });
  //   // }
  // };
  //
  // const setAppExceptionFilters = (app: INestApplication) => {
  //   app.useGlobalFilters(new HttpExceptionFilter());
};

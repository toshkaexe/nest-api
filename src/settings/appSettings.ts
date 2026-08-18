import dotenv from 'dotenv';
import process from 'process';
dotenv.config();

export const AppSettings = {
  PORT: process.env.PORT,
  ACCESS_JWT_SECRET: process.env.ACCESS_JWT_SECRET,
  ACCESS_JWT_EXPIRES: '5m',
  REFRESH_JWT_SECRET: process.env.REFRESH_JWT_SECRET,
  REFRESH_JWT_EXPIRES: '10h',
  AUTH_LOGIN: process.env.AUTH_LOGIN,
  AUTH_PASSWORD: process.env.AUTH_PASSWORD,
  MONGO_URI: process.env.MONGO_URI_CLOUD,
  MONGO_LOCAL_URI: process.env.MONGO_URI_LOCAL,
  DB_NANE_NEST: 'nest_base',
  DB_NAME: process.env.DB_NAME,
  SEND_MAIL_SERVICE_EMAIL: process.env.EMAIL,
  EMAIL_PWS: process.env.EMAIL_PWS,
  MONGO_URI_CLOUD: process.env.MONGO_URI_CLOUD,
  MONGO_URI_LOCAL: process.env.MONGO_URI_CLOUD,
  POSTGRES_URL: process.env.POSTGRES_URL,
};

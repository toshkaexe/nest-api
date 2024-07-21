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
  MONGO_LOCAL_URI: process.env.MONGO_URI_LOCAL,
  DB_NANE_NEST: 'nest_base',
  DB_NAME: process.env.DB_NAME,
  SEND_MAIL_SERVICE_EMAIL: process.env.EMAIL,
  EMAIL_PWS: process.env.EMAIL_PWS,
  MONGO_URI_CLOUD: process.env.MONGO_URI_CLOUD,
  MONGO_URI_LOCAL: process.env.MONGO_URI_CLOUD,
};

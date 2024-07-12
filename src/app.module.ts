import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { UserController } from './features/users/user.controller';
import { UserService } from './features/users/user.service';
import { UsersRepository } from './features/users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import process from 'process';

const userProvider = [UsersRepository, UserService];

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(
      `${process.env.MONGO_URI_CLOUD}${process.env.DB_NAME}`,
    ),
  ],
  providers: [AppService, ...userProvider],
  controllers: [UserController, AppController],
})
export class AppModule {}

//  MongooseModule.forRoot(
//`${process.env.MONGO_URI_CLOUD!}${process.env.DB_NAME}`,
// ),

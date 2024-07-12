import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { UserController } from './features/users/user.controller';
import { UserService } from './features/users/user.service';
import { UsersRepository } from './features/users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import process from 'process';
import { Item, ItemSchema } from './item/item';
import { ItemService } from './item/itemService';
import { ItemController } from './item/ItemController';

const userProvider = [UsersRepository, UserService];

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRoot(
      `${process.env.MONGO_URI_CLOUD}/${process.env.DB_NANE_NEST}`,
    ),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  providers: [AppService, ...userProvider, ItemService],
  controllers: [UserController, AppController, ItemController],
})
export class AppModule {}

//  MongooseModule.forRoot(
//`${process.env.MONGO_URI_CLOUD!}${process.env.DB_NAME}`,
// ),

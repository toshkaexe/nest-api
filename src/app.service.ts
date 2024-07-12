import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getHello(): string {
    return 'Hello World!';
  }
  async onModuleInit() {
    this.checkDatabaseConnection();
  }

  async checkDatabaseConnection() {
    try {
      await this.connection.asPromise();
      console.log('Connection to MongoDB established successfully.');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error.message);
    }
  }
}

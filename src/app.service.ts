import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {InjectConnection} from '@nestjs/mongoose';
import {Connection} from 'mongoose';

@Injectable()
export class AppService implements OnModuleInit {
    private readonly logger = new Logger(AppService.name);

    constructor(@InjectConnection() private readonly connection: Connection) {
    }

    getHello(): string {
        return 'Hello World!';
    }

    async onModuleInit() {
        this.checkDatabaseConnection();
    }

    async checkDatabaseConnection() {
        try {
            await this.connection.asPromise();
            this.logger.log('Connection to MongoDB established successfully.');
        } catch (error) {
            this.logger.error('Failed to connect to MongoDB:', error.message);
        }
    }
}

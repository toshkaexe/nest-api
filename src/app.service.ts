import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    await this.checkDatabaseConnection();
  }

  async checkDatabaseConnection() {
    try {
      await this.pool.query('SELECT 1');
      this.logger.log('Connection to PostgreSQL established successfully.');
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL:', error.message);
    }
  }
}

import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PgInitService implements OnModuleInit {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async onModuleInit() {
    const sql = fs.readFileSync(
      path.join(__dirname, 'pg-init.sql'),
      'utf-8',
    );
    await this.pool.query(sql);
  }
}

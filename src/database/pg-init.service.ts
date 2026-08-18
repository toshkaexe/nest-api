import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PgInitService implements OnModuleInit {
  constructor(@Inject('POSTGRES_POOL') private readonly pool: Pool) {}

  async onModuleInit() {
    const sqlPath = path.join(__dirname, 'pg-init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await this.pool.query(sql);
    console.log('PostgreSQL tables initialized');
  }
}

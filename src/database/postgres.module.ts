import { Module, Global, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { AppSettings } from '../settings/appSettings';
import { PgInitService } from './pg-init.service';

const pool = new Pool({
  connectionString: AppSettings.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

@Global()
@Module({
  providers: [
    {
      provide: 'POSTGRES_POOL',
      useValue: pool,
    },
    PgInitService,
  ],
  exports: ['POSTGRES_POOL'],
})
export class PostgresModule implements OnModuleDestroy {
  async onModuleDestroy() {
    await pool.end();
  }
}

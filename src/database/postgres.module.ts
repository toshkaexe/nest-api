import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { AppSettings } from '../settings/appSettings';

const pool = new Pool({
  connectionString: AppSettings.POSTGRES_URL,
});

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useValue: pool,
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class PostgresModule {}

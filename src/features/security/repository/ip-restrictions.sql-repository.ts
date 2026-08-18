import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class IpRestrictionsSqlRepository {
  constructor(@Inject('POSTGRES_POOL') private readonly pool: Pool) {}

  async addRequest(ip: string, url: string, date: Date): Promise<void> {
    await this.pool.query(
      `INSERT INTO ip_restrictions (ip, url, date) VALUES ($1, $2, $3)`,
      [ip, url, date],
    );
  }

  async countRequestsInInterval(
    ip: string,
    url: string,
    fromDate: Date,
  ): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM ip_restrictions
       WHERE ip = $1 AND url = $2 AND date >= $3`,
      [ip, url, fromDate],
    );
    return parseInt(result.rows[0].count, 10);
  }

  async deleteOlderThan(date: Date): Promise<void> {
    await this.pool.query(`DELETE FROM ip_restrictions WHERE date < $1`, [date]);
  }

  async findAll(): Promise<{ id: number; ip: string; url: string; date: Date }[]> {
    const result = await this.pool.query(
      `SELECT id, ip, url, date FROM ip_restrictions ORDER BY date DESC`,
    );
    return result.rows;
  }

  async deleteAll(): Promise<void> {
    await this.pool.query(`DELETE FROM ip_restrictions`);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

export interface RefreshTokenMetaRow {
  id: number;
  device_id: string;
  user_id: string;
  ip: string;
  title: string;
  issued_at: Date;
  expires_at: Date;
  last_active_date: Date;
}

export interface RefreshTokenMetaView {
  deviceId: string;
  userId: string;
  ip: string;
  title: string;
  issuedAt: Date;
  expiresAt: Date;
  lastActiveDate: Date;
}

@Injectable()
export class RefreshTokenMetaSqlRepository {
  constructor(@Inject('POSTGRES_POOL') private readonly pool: Pool) {}

  async create(data: {
    deviceId: string;
    userId: string;
    ip: string;
    title: string;
    issuedAt: Date;
    expiresAt: Date;
    lastActiveDate: Date;
  }): Promise<void> {
    await this.pool.query(
      `INSERT INTO refresh_token_meta (device_id, user_id, ip, title, issued_at, expires_at, last_active_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        data.deviceId,
        data.userId,
        data.ip,
        data.title,
        data.issuedAt,
        data.expiresAt,
        data.lastActiveDate,
      ],
    );
  }

  async findByDeviceIdAndIssuedAt(
    deviceId: string,
    issuedAt: Date,
  ): Promise<RefreshTokenMetaView | null> {
    const result = await this.pool.query<RefreshTokenMetaRow>(
      `SELECT * FROM refresh_token_meta WHERE device_id = $1 AND issued_at = $2`,
      [deviceId, issuedAt],
    );
    return result.rows[0] ? this.mapToView(result.rows[0]) : null;
  }

  async findByDeviceId(deviceId: string): Promise<RefreshTokenMetaView | null> {
    const result = await this.pool.query<RefreshTokenMetaRow>(
      `SELECT * FROM refresh_token_meta WHERE device_id = $1`,
      [deviceId],
    );
    return result.rows[0] ? this.mapToView(result.rows[0]) : null;
  }

  async findAllByUserId(userId: string): Promise<RefreshTokenMetaView[]> {
    const result = await this.pool.query<RefreshTokenMetaRow>(
      `SELECT * FROM refresh_token_meta WHERE user_id = $1`,
      [userId],
    );
    return result.rows.map(this.mapToView);
  }

  async updateSession(
    deviceId: string,
    newIssuedAt: Date,
    newExpiresAt: Date,
    newLastActiveDate: Date,
  ): Promise<void> {
    await this.pool.query(
      `UPDATE refresh_token_meta
       SET issued_at = $2, expires_at = $3, last_active_date = $4
       WHERE device_id = $1`,
      [deviceId, newIssuedAt, newExpiresAt, newLastActiveDate],
    );
  }

  async deleteByDeviceId(deviceId: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM refresh_token_meta WHERE device_id = $1`,
      [deviceId],
    );
  }

  async deleteAllByUserIdExcept(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    await this.pool.query(
      `DELETE FROM refresh_token_meta WHERE user_id = $1 AND device_id != $2`,
      [userId, deviceId],
    );
  }

  async deleteAll(): Promise<void> {
    await this.pool.query(`DELETE FROM refresh_token_meta`);
  }

  private mapToView(row: RefreshTokenMetaRow): RefreshTokenMetaView {
    return {
      deviceId: row.device_id,
      userId: row.user_id,
      ip: row.ip,
      title: row.title,
      issuedAt: row.issued_at,
      expiresAt: row.expires_at,
      lastActiveDate: row.last_active_date,
    };
  }
}

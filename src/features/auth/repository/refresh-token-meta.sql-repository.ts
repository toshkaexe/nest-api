import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class RefreshTokenMetaSqlRepository {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

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

  async findByDeviceIdAndIssuedAt(deviceId: string, issuedAt: Date) {
    const result = await this.pool.query(
      `SELECT id, device_id as "deviceId", user_id as "userId", ip, title,
              issued_at as "issuedAt", expires_at as "expiresAt", last_active_date as "lastActiveDate"
       FROM refresh_token_meta WHERE device_id = $1 AND issued_at = $2`,
      [deviceId, issuedAt],
    );
    return result.rows[0] || null;
  }

  async findByDeviceId(deviceId: string) {
    const result = await this.pool.query(
      `SELECT id, device_id as "deviceId", user_id as "userId", ip, title,
              issued_at as "issuedAt", expires_at as "expiresAt", last_active_date as "lastActiveDate"
       FROM refresh_token_meta WHERE device_id = $1`,
      [deviceId],
    );
    return result.rows[0] || null;
  }

  async findAllByUserId(userId: string) {
    const result = await this.pool.query(
      `SELECT id, device_id as "deviceId", user_id as "userId", ip, title,
              issued_at as "issuedAt", expires_at as "expiresAt", last_active_date as "lastActiveDate"
       FROM refresh_token_meta WHERE user_id = $1`,
      [userId],
    );
    return result.rows;
  }

  async updateSession(
    deviceId: string,
    newIssuedAt: Date,
    newExpiresAt: Date,
    newLastActiveDate: Date,
  ): Promise<void> {
    await this.pool.query(
      `UPDATE refresh_token_meta SET issued_at = $1, expires_at = $2, last_active_date = $3 WHERE device_id = $4`,
      [newIssuedAt, newExpiresAt, newLastActiveDate, deviceId],
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
}

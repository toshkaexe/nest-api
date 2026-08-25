import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersSqlRepository {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async create(newUser: any): Promise<string> {
    const result = await this.pool.query(
      `INSERT INTO users (login, password, email, created_at, confirmation_code, confirmation_code_expires_at, is_confirmed)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        newUser.login,
        newUser.password,
        newUser.email,
        newUser.createdAt || new Date(),
        newUser.confirmationCode || null,
        newUser.confirmationCodeExpiresAt || null,
        newUser.isConfirmed || false,
      ],
    );
    return result.rows[0].id;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.pool.query(
        `DELETE FROM users WHERE id = $1`,
        [id],
      );
      return (result.rowCount ?? 0) === 1;
    } catch {
      return false;
    }
  }

  async deleteAll(): Promise<boolean> {
    await this.pool.query(`DELETE FROM refresh_token_meta`);
    await this.pool.query(`DELETE FROM users`);
    return true;
  }

  async updateRecoveryCode(
    userId: string,
    recoveryCode: string,
    expiresAt: Date,
  ): Promise<boolean> {
    try {
      const result = await this.pool.query(
        `UPDATE users SET recovery_code = $1, recovery_code_expires_at = $2 WHERE id = $3`,
        [recoveryCode, expiresAt, userId],
      );
      return (result.rowCount ?? 0) === 1;
    } catch {
      return false;
    }
  }

  async updateConfirmationCode(
    userId: string,
    confirmationCode: string,
    expiresAt: Date,
  ): Promise<boolean> {
    try {
      const result = await this.pool.query(
        `UPDATE users SET confirmation_code = $1, confirmation_code_expires_at = $2 WHERE id = $3`,
        [confirmationCode, expiresAt, userId],
      );
      return (result.rowCount ?? 0) === 1;
    } catch {
      return false;
    }
  }

  async findByConfirmationCode(code: string) {
    const result = await this.pool.query(
      `SELECT id, login, password, email, created_at as "createdAt",
              confirmation_code as "confirmationCode",
              confirmation_code_expires_at as "confirmationCodeExpiresAt",
              is_confirmed as "isConfirmed",
              recovery_code as "recoveryCode",
              recovery_code_expires_at as "recoveryCodeExpiresAt"
       FROM users WHERE confirmation_code = $1`,
      [code],
    );
    if (!result.rows[0]) return null;
    return { _id: result.rows[0].id, ...result.rows[0] };
  }

  async confirmUser(userId: string): Promise<boolean> {
    try {
      const result = await this.pool.query(
        `UPDATE users SET is_confirmed = true, confirmation_code = NULL, confirmation_code_expires_at = NULL WHERE id = $1`,
        [userId],
      );
      return (result.rowCount ?? 0) === 1;
    } catch {
      return false;
    }
  }

  async findByRecoveryCode(recoveryCode: string) {
    const result = await this.pool.query(
      `SELECT id, login, password, email, created_at as "createdAt",
              confirmation_code as "confirmationCode",
              confirmation_code_expires_at as "confirmationCodeExpiresAt",
              is_confirmed as "isConfirmed",
              recovery_code as "recoveryCode",
              recovery_code_expires_at as "recoveryCodeExpiresAt"
       FROM users WHERE recovery_code = $1`,
      [recoveryCode],
    );
    if (!result.rows[0]) return null;
    return { _id: result.rows[0].id, ...result.rows[0] };
  }

  async updatePassword(userId: string, passwordHash: string): Promise<boolean> {
    try {
      const result = await this.pool.query(
        `UPDATE users SET password = $1, recovery_code = NULL, recovery_code_expires_at = NULL WHERE id = $2`,
        [passwordHash, userId],
      );
      return (result.rowCount ?? 0) === 1;
    } catch {
      return false;
    }
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { UserOutputModel } from '../dto/output/user-output.model';
import {
  PaginationOutput,
  PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/model/pagination.base.model';

@Injectable()
export class UsersSqlQueryRepository {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async getById(id: string): Promise<UserOutputModel | null> {
    try {
      const result = await this.pool.query(
        `SELECT id, login, email, created_at as "createdAt" FROM users WHERE id = $1`,
        [id],
      );
      if (!result.rows[0]) return null;
      return this.mapToOutput(result.rows[0]);
    } catch {
      return null;
    }
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<any | null> {
    const result = await this.pool.query(
      `SELECT id, login, password, email, created_at as "createdAt",
              confirmation_code as "confirmationCode",
              confirmation_code_expires_at as "confirmationCodeExpiresAt",
              is_confirmed as "isConfirmed",
              recovery_code as "recoveryCode",
              recovery_code_expires_at as "recoveryCodeExpiresAt"
       FROM users WHERE login = $1 OR email = $1`,
      [loginOrEmail],
    );
    if (!result.rows[0]) return null;
    return { _id: result.rows[0].id, ...result.rows[0] };
  }

  async getAll(
    pagination: PaginationWithSearchLoginAndEmailTerm,
  ): Promise<PaginationOutput<UserOutputModel>> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (pagination.searchEmailTerm) {
      params.push(`%${pagination.searchEmailTerm}%`);
      conditions.push(`email ILIKE $${params.length}`);
    }

    if (pagination.searchLoginTerm) {
      params.push(`%${pagination.searchLoginTerm}%`);
      conditions.push(`login ILIKE $${params.length}`);
    }

    const where = conditions.length > 0
      ? `WHERE ${conditions.join(' OR ')}`
      : '';

    const sortBy = this.mapSortField(pagination.sortBy);
    const sortDir = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const countResult = await this.pool.query(
      `SELECT COUNT(*) FROM users ${where}`,
      params,
    );
    const totalCount = parseInt(countResult.rows[0].count);

    const offset = pagination.getSkipItemsCount();
    const limit = pagination.pageSize;

    const itemsResult = await this.pool.query(
      `SELECT id, login, email, created_at as "createdAt"
       FROM users ${where}
       ORDER BY "${sortBy}" ${sortDir}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset],
    );

    const items: UserOutputModel[] = itemsResult.rows.map((row) =>
      this.mapToOutput(row),
    );

    return new PaginationOutput<UserOutputModel>(
      items,
      pagination.pageNumber,
      pagination.pageSize,
      totalCount,
    );
  }

  private mapToOutput(row: any): UserOutputModel {
    const output = new UserOutputModel();
    output.id = row.id;
    output.login = row.login;
    output.email = row.email;
    output.createdAt = new Date(row.createdAt).toISOString();
    return output;
  }

  private mapSortField(sortBy: string): string {
    const mapping: Record<string, string> = {
      login: 'login',
      email: 'email',
      createdAt: 'created_at',
    };
    return mapping[sortBy] || 'created_at';
  }
}

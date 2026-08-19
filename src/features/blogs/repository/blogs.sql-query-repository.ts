import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import {
  PaginationWithSearchLoginAndEmailTerm,
  PaginationOutput,
} from '../../../base/model/pagination.base.model';
import { BlogOutputModel } from '../dto/output/blog.output.model';

@Injectable()
export class BlogsSqlQueryRepository {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async getAll(
    pagination: PaginationWithSearchLoginAndEmailTerm,
  ): Promise<PaginationOutput<BlogOutputModel>> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (pagination.searchNameTerm) {
      params.push(`%${pagination.searchNameTerm}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sortBy = this.mapSortField(pagination.sortBy);
    const sortDir = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const countResult = await this.pool.query(
      `SELECT COUNT(*) FROM blogs ${where}`,
      params,
    );
    const totalCount = parseInt(countResult.rows[0].count);

    const offset = pagination.getSkipItemsCount();
    const limit = pagination.pageSize;

    const itemsResult = await this.pool.query(
      `SELECT id, name, description, website_url as "websiteUrl", created_at as "createdAt", is_membership as "isMembership"
       FROM blogs ${where}
       ORDER BY "${sortBy}" ${sortDir}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset],
    );

    const items: BlogOutputModel[] = itemsResult.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      websiteUrl: row.websiteUrl,
      createdAt: new Date(row.createdAt).toISOString(),
      isMembership: row.isMembership,
    }));

    return new PaginationOutput(items, pagination.pageNumber, pagination.pageSize, totalCount);
  }

  private mapSortField(sortBy: string): string {
    const mapping: Record<string, string> = {
      name: 'name',
      createdAt: 'created_at',
      description: 'description',
      websiteUrl: 'website_url',
    };
    return mapping[sortBy] || 'created_at';
  }
}

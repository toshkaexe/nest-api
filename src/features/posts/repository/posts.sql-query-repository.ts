import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import {
  PaginationOutput,
  PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/model/pagination.base.model';
import { OutputPostModel } from '../dto/output/posts.output.model';

@Injectable()
export class PostsSqlQueryRepository {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async getAll(
    pagination: PaginationWithSearchLoginAndEmailTerm,
    userId: string | null = null,
  ): Promise<PaginationOutput<OutputPostModel>> {
    const conditions: string[] = [];
    const params: any[] = [];

    if (pagination.searchNameTerm) {
      params.push(`%${pagination.searchNameTerm}%`);
      conditions.push(`title ILIKE $${params.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sortBy = this.mapSortField(pagination.sortBy);
    const sortDir = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const countResult = await this.pool.query(
      `SELECT COUNT(*) FROM posts ${where}`,
      params,
    );
    const totalCount = parseInt(countResult.rows[0].count);

    const offset = pagination.getSkipItemsCount();
    const limit = pagination.pageSize;

    const itemsResult = await this.pool.query(
      `SELECT id, title, short_description as "shortDescription", content, blog_id as "blogId", blog_name as "blogName", created_at as "createdAt"
       FROM posts ${where}
       ORDER BY "${sortBy}" ${sortDir}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset],
    );

    const items: OutputPostModel[] = itemsResult.rows.map((row) => this.mapToOutput(row));

    return new PaginationOutput(items, pagination.pageNumber, pagination.pageSize, totalCount);
  }

  async getPostsForBlog(
    blogId: string,
    pagination: PaginationWithSearchLoginAndEmailTerm,
    userId: string | null = null,
  ): Promise<PaginationOutput<OutputPostModel>> {
    const sortBy = this.mapSortField(pagination.sortBy);
    const sortDir = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const countResult = await this.pool.query(
      `SELECT COUNT(*) FROM posts WHERE blog_id = $1`,
      [blogId],
    );
    const totalCount = parseInt(countResult.rows[0].count);

    const offset = pagination.getSkipItemsCount();
    const limit = pagination.pageSize;

    const itemsResult = await this.pool.query(
      `SELECT id, title, short_description as "shortDescription", content, blog_id as "blogId", blog_name as "blogName", created_at as "createdAt"
       FROM posts WHERE blog_id = $1
       ORDER BY "${sortBy}" ${sortDir}
       LIMIT $2 OFFSET $3`,
      [blogId, limit, offset],
    );

    const items: OutputPostModel[] = itemsResult.rows.map((row) => this.mapToOutput(row));

    return new PaginationOutput(items, pagination.pageNumber, pagination.pageSize, totalCount);
  }

  async getById(postId: string, userId: string | null = null): Promise<OutputPostModel | null> {
    try {
      const result = await this.pool.query(
        `SELECT id, title, short_description as "shortDescription", content, blog_id as "blogId", blog_name as "blogName", created_at as "createdAt"
         FROM posts WHERE id = $1`,
        [postId],
      );

      if (result.rows.length === 0) return null;
      return this.mapToOutput(result.rows[0]);
    } catch {
      return null;
    }
  }

  private mapToOutput(row: any): OutputPostModel {
    return {
      id: row.id,
      title: row.title,
      shortDescription: row.shortDescription,
      content: row.content,
      blogId: row.blogId,
      blogName: row.blogName,
      createdAt: new Date(row.createdAt).toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  private mapSortField(sortBy: string): string {
    const mapping: Record<string, string> = {
      title: 'title',
      createdAt: 'created_at',
      shortDescription: 'short_description',
      content: 'content',
      blogId: 'blog_id',
      blogName: 'blog_name',
    };
    return mapping[sortBy] || 'created_at';
  }
}

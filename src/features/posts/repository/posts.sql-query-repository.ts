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

    const items: OutputPostModel[] = await Promise.all(
      itemsResult.rows.map((row) => this.mapToOutput(row, userId)),
    );

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

    const items: OutputPostModel[] = await Promise.all(
      itemsResult.rows.map((row) => this.mapToOutput(row, userId)),
    );

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
      return this.mapToOutput(result.rows[0], userId);
    } catch {
      return null;
    }
  }

  private async mapToOutput(row: any, userId: string | null = null): Promise<OutputPostModel> {
    const likesCountResult = await this.pool.query(
      `SELECT COUNT(*) FROM post_likes WHERE post_id = $1 AND status = 'Like'`,
      [row.id],
    );
    const dislikesCountResult = await this.pool.query(
      `SELECT COUNT(*) FROM post_likes WHERE post_id = $1 AND status = 'Dislike'`,
      [row.id],
    );

    let myStatus = 'None';
    if (userId) {
      const myStatusResult = await this.pool.query(
        `SELECT status FROM post_likes WHERE post_id = $1 AND user_id = $2`,
        [row.id, userId],
      );
      myStatus = myStatusResult.rows[0]?.status || 'None';
    }

    const newestLikesResult = await this.pool.query(
      `SELECT user_id as "userId", login, added_at as "addedAt"
       FROM post_likes WHERE post_id = $1 AND status = 'Like'
       ORDER BY added_at DESC
       LIMIT 3`,
      [row.id],
    );

    return {
      id: row.id,
      title: row.title,
      shortDescription: row.shortDescription,
      content: row.content,
      blogId: row.blogId,
      blogName: row.blogName,
      createdAt: new Date(row.createdAt).toISOString(),
      extendedLikesInfo: {
        likesCount: parseInt(likesCountResult.rows[0].count),
        dislikesCount: parseInt(dislikesCountResult.rows[0].count),
        myStatus,
        newestLikes: newestLikesResult.rows.map((like) => ({
          addedAt: new Date(like.addedAt).toISOString(),
          userId: like.userId,
          login: like.login,
        })),
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

import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { CommentOutputModel } from '../dto/output/comment.output.model';
import {
  PaginationOutput,
  PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/model/pagination.base.model';

@Injectable()
export class CommentsSqlQueryRepository {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async getById(
    id: string,
    userId?: string | null,
  ): Promise<CommentOutputModel | null> {
    try {
      const result = await this.pool.query(
        `SELECT id, post_id as "postId", content, user_id as "userId", user_login as "userLogin",
                likes_count as "likesCount", dislikes_count as "dislikesCount", created_at as "createdAt"
         FROM comments WHERE id = $1`,
        [id],
      );

      if (result.rows.length === 0) return null;

      const comment = result.rows[0];
      const myStatus = userId
        ? await this.getUserLikeStatus(id, userId)
        : 'None';

      return this.mapToOutput(comment, myStatus);
    } catch {
      return null;
    }
  }

  async getCommentsForPost(
    postId: string,
    pagination: PaginationWithSearchLoginAndEmailTerm,
    userId?: string | null,
  ): Promise<PaginationOutput<CommentOutputModel>> {
    const sortBy = this.mapSortField(pagination.sortBy);
    const sortDir = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const countResult = await this.pool.query(
      `SELECT COUNT(*) FROM comments WHERE post_id = $1`,
      [postId],
    );
    const totalCount = parseInt(countResult.rows[0].count);

    const offset = pagination.getSkipItemsCount();
    const limit = pagination.pageSize;

    const itemsResult = await this.pool.query(
      `SELECT id, post_id as "postId", content, user_id as "userId", user_login as "userLogin",
              likes_count as "likesCount", dislikes_count as "dislikesCount", created_at as "createdAt"
       FROM comments WHERE post_id = $1
       ORDER BY "${sortBy}" ${sortDir}
       LIMIT $2 OFFSET $3`,
      [postId, limit, offset],
    );

    const items: CommentOutputModel[] = await Promise.all(
      itemsResult.rows.map(async (row) => {
        const myStatus = userId
          ? await this.getUserLikeStatus(row.id, userId)
          : 'None';
        return this.mapToOutput(row, myStatus);
      }),
    );

    return new PaginationOutput<CommentOutputModel>(
      items,
      pagination.pageNumber,
      pagination.pageSize,
      totalCount,
    );
  }

  private async getUserLikeStatus(
    commentId: string,
    userId: string,
  ): Promise<string> {
    const result = await this.pool.query(
      `SELECT status FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
      [commentId, userId],
    );
    return result.rows[0]?.status || 'None';
  }

  private mapToOutput(row: any, myStatus: string): CommentOutputModel {
    return {
      id: row.id,
      content: row.content,
      commentatorInfo: {
        userId: row.userId,
        userLogin: row.userLogin,
      },
      createdAt: new Date(row.createdAt).toISOString(),
      likesInfo: {
        likesCount: row.likesCount,
        dislikesCount: row.dislikesCount,
        myStatus,
      },
    };
  }

  private mapSortField(sortBy: string): string {
    const mapping: Record<string, string> = {
      content: 'content',
      createdAt: 'created_at',
    };
    return mapping[sortBy] || 'created_at';
  }
}

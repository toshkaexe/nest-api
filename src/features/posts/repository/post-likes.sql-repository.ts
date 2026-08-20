import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PostLikesSqlRepository {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async setLikeStatus(
    postId: string,
    userId: string,
    login: string,
    status: string,
  ): Promise<void> {
    if (status === 'None') {
      await this.pool.query(
        `DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`,
        [postId, userId],
      );
    } else {
      await this.pool.query(
        `INSERT INTO post_likes (post_id, user_id, login, status, added_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (post_id, user_id)
         DO UPDATE SET status = $4, added_at = NOW()`,
        [postId, userId, login, status],
      );
    }
  }

  async findUserLikeForPost(
    postId: string,
    userId: string,
  ): Promise<{ status: string } | null> {
    const result = await this.pool.query(
      `SELECT status FROM post_likes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId],
    );
    return result.rows[0] || null;
  }

  async getLikesCount(postId: string): Promise<number> {
    const result = await this.pool.query(
      `SELECT COUNT(*) FROM post_likes WHERE post_id = $1 AND status = 'Like'`,
      [postId],
    );
    return parseInt(result.rows[0].count);
  }

  async getDislikesCount(postId: string): Promise<number> {
    const result = await this.pool.query(
      `SELECT COUNT(*) FROM post_likes WHERE post_id = $1 AND status = 'Dislike'`,
      [postId],
    );
    return parseInt(result.rows[0].count);
  }

  async getNewestLikes(
    postId: string,
    limit: number = 3,
  ): Promise<Array<{ addedAt: string; userId: string; login: string }>> {
    const result = await this.pool.query(
      `SELECT user_id as "userId", login, added_at as "addedAt"
       FROM post_likes WHERE post_id = $1 AND status = 'Like'
       ORDER BY added_at DESC
       LIMIT $2`,
      [postId, limit],
    );
    return result.rows.map((row) => ({
      addedAt: new Date(row.addedAt).toISOString(),
      userId: row.userId,
      login: row.login,
    }));
  }

  async deleteAll(): Promise<void> {
    await this.pool.query(`DELETE FROM post_likes`);
  }
}

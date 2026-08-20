import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CommentsSqlRepository {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async create(data: {
    postId: string;
    content: string;
    userId: string;
    userLogin: string;
    createdAt: string;
  }): Promise<string> {
    const result = await this.pool.query(
      `INSERT INTO comments (post_id, content, user_id, user_login, created_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [data.postId, data.content, data.userId, data.userLogin, data.createdAt],
    );
    return result.rows[0].id;
  }

  async findById(id: string) {
    try {
      const result = await this.pool.query(
        `SELECT id, post_id as "postId", content, user_id as "userId", user_login as "userLogin",
                likes_count as "likesCount", dislikes_count as "dislikesCount", created_at as "createdAt"
         FROM comments WHERE id = $1`,
        [id],
      );
      return result.rows[0] || null;
    } catch {
      return null;
    }
  }

  async updateContent(id: string, content: string): Promise<boolean> {
    try {
      const result = await this.pool.query(
        `UPDATE comments SET content = $1 WHERE id = $2`,
        [content, id],
      );
      return (result.rowCount ?? 0) > 0;
    } catch {
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.pool.query(
        `DELETE FROM comments WHERE id = $1`,
        [id],
      );
      return (result.rowCount ?? 0) > 0;
    } catch {
      return false;
    }
  }

  async deleteAll(): Promise<boolean> {
    await this.pool.query(`DELETE FROM comment_likes`);
    await this.pool.query(`DELETE FROM comments`);
    return true;
  }

  async findUserLikeStatus(commentId: string, userId: string): Promise<string> {
    try {
      const result = await this.pool.query(
        `SELECT status FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
        [commentId, userId],
      );
      return result.rows[0]?.status || 'None';
    } catch {
      return 'None';
    }
  }

  async setLikeStatus(
    commentId: string,
    userId: string,
    likeStatus: string,
  ): Promise<void> {
    const oldStatusResult = await this.pool.query(
      `SELECT status FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
      [commentId, userId],
    );
    const oldStatus = oldStatusResult.rows[0]?.status || 'None';

    if (oldStatus === likeStatus) return;

    if (likeStatus === 'None') {
      await this.pool.query(
        `DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2`,
        [commentId, userId],
      );
    } else if (oldStatus !== 'None') {
      await this.pool.query(
        `UPDATE comment_likes SET status = $1 WHERE comment_id = $2 AND user_id = $3`,
        [likeStatus, commentId, userId],
      );
    } else {
      await this.pool.query(
        `INSERT INTO comment_likes (comment_id, user_id, status) VALUES ($1, $2, $3)`,
        [commentId, userId, likeStatus],
      );
    }

    const likesCountDelta =
      (likeStatus === 'Like' ? 1 : 0) - (oldStatus === 'Like' ? 1 : 0);
    const dislikesCountDelta =
      (likeStatus === 'Dislike' ? 1 : 0) - (oldStatus === 'Dislike' ? 1 : 0);

    await this.pool.query(
      `UPDATE comments SET likes_count = likes_count + $1, dislikes_count = dislikes_count + $2 WHERE id = $3`,
      [likesCountDelta, dislikesCountDelta, commentId],
    );
  }
}

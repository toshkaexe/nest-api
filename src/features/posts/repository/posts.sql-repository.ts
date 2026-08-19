import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PostsSqlRepository {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async save(newPost: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
  }) {
    const result = await this.pool.query(
      `INSERT INTO posts (title, short_description, content, blog_id, blog_name, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, short_description as "shortDescription", content, blog_id as "blogId", blog_name as "blogName", created_at as "createdAt"`,
      [newPost.title, newPost.shortDescription, newPost.content, newPost.blogId, newPost.blogName, newPost.createdAt],
    );
    return result.rows[0];
  }

  async findById(id: string) {
    try {
      const result = await this.pool.query(
        `SELECT id, title, short_description as "shortDescription", content, blog_id as "blogId", blog_name as "blogName", created_at as "createdAt"
         FROM posts WHERE id = $1`,
        [id],
      );
      return result.rows[0] || null;
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.pool.query(
        `DELETE FROM posts WHERE id = $1`,
        [id],
      );
      return (result.rowCount ?? 0) > 0;
    } catch {
      return false;
    }
  }

  async update(id: string, body: { title: string; shortDescription: string; content: string; blogId: string }): Promise<boolean> {
    try {
      const result = await this.pool.query(
        `UPDATE posts SET title = $1, short_description = $2, content = $3, blog_id = $4 WHERE id = $5`,
        [body.title, body.shortDescription, body.content, body.blogId, id],
      );
      return (result.rowCount ?? 0) > 0;
    } catch {
      return false;
    }
  }

  async deleteAll(): Promise<boolean> {
    await this.pool.query(`DELETE FROM posts`);
    return true;
  }
}

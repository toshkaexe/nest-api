import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class BlogsSqlRepository {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async save(newBlog: {
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
  }) {
    const result = await this.pool.query(
      `INSERT INTO blogs (name, description, website_url, created_at, is_membership)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, website_url as "websiteUrl", created_at as "createdAt", is_membership as "isMembership"`,
      [newBlog.name, newBlog.description, newBlog.websiteUrl, newBlog.createdAt, newBlog.isMembership],
    );
    return result.rows[0];
  }

  async getBlogById(id: string) {
    try {
      const result = await this.pool.query(
        `SELECT id, name, description, website_url as "websiteUrl", created_at as "createdAt", is_membership as "isMembership"
         FROM blogs WHERE id = $1`,
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
        `DELETE FROM blogs WHERE id = $1`,
        [id],
      );
      return (result.rowCount ?? 0) > 0;
    } catch {
      return false;
    }
  }

  async update(id: string, blog: { name: string; description: string; websiteUrl: string }): Promise<boolean> {
    const result = await this.pool.query(
      `UPDATE blogs SET name = $1, description = $2, website_url = $3 WHERE id = $4`,
      [blog.name, blog.description, blog.websiteUrl, id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return true;
  }

  async deleteAll(): Promise<boolean> {
    await this.pool.query(`DELETE FROM blogs`);
    return true;
  }
}

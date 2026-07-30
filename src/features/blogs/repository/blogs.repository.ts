import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async save(newBlog: Blog): Promise<BlogDocument> {
    const insertResult = await this.BlogModel.insertMany([newBlog]);

    console.log('insertResult = lol', insertResult);
    return insertResult[0];
  }

  async getBlogById(id: string): Promise<Blog | null> {
    try {
      const blog = await this.BlogModel.findOne({ _id: id });
      return blog;
    } catch (error) {
      // Invalid ObjectId format returns null instead of throwing
      return null;
    }
  }

  async getAll(): Promise<Blog[]> {
    return this.BlogModel.find().exec();
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await this.BlogModel.deleteOne({ _id: id });
    return deleteResult.deletedCount > 0;
  }

  async update(id, blog: Blog): Promise<Blog> {
    const updatedBlog = await this.BlogModel.findByIdAndUpdate(id, blog, {
      new: true,
    }).exec();
    if (!updatedBlog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return updatedBlog;
  }

  async deleteAll(): Promise<boolean> {
    const deleteResult = await this.BlogModel.deleteMany({});
    return !deleteResult; // Returns true if at least one document was deleted
  }
}

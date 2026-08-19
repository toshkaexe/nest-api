import { CreateBlogModel } from '../dto/input/create-blog.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsSqlRepository } from '../repository/blogs.sql-repository';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsSqlRepository) {}

  async create(createModel: CreateBlogModel) {
    const createNewBlog = {
      name: createModel.name,
      description: createModel.description,
      websiteUrl: createModel.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    const savedBlog = await this.blogsRepository.save(createNewBlog);

    return {
      id: savedBlog.id,
      name: savedBlog.name,
      description: savedBlog.description,
      websiteUrl: savedBlog.websiteUrl,
      createdAt: new Date(savedBlog.createdAt).toISOString(),
      isMembership: savedBlog.isMembership,
    };
  }

  async deleteAll(): Promise<boolean> {
    return await this.blogsRepository.deleteAll();
  }

  async remove(id: string): Promise<boolean> {
    return await this.blogsRepository.delete(id);
  }

  async findBlogById(id: string) {
    return await this.blogsRepository.getBlogById(id);
  }

  async update(id: string, updateModel: CreateBlogModel): Promise<boolean> {
    const blog = await this.blogsRepository.getBlogById(id);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    return await this.blogsRepository.update(id, {
      name: updateModel.name,
      description: updateModel.description,
      websiteUrl: updateModel.websiteUrl,
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsSqlRepository } from '../../blogs/repository/blogs.sql-repository';
import { PostsSqlRepository } from '../repository/posts.sql-repository';
import { PostLikesSqlRepository } from '../repository/post-likes.sql-repository';
import {
  CreateNewPost,
  CreateNewPostForGivenBlogId,
  UpdatePostsData,
} from '../dto/input/create-new-post.model';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsSqlRepository,
    private readonly blogsRepository: BlogsSqlRepository,
    private readonly postLikesRepository: PostLikesSqlRepository,
  ) {}

  async create(data: CreateNewPost) {
    const blog = await this.blogsRepository.getBlogById(data.blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${data.blogId} not found`);
    }

    const newPost = {
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: data.blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await this.postsRepository.save(newPost);

    return {
      id: createdPost.id,
      title: createdPost.title,
      shortDescription: createdPost.shortDescription,
      content: createdPost.content,
      blogId: createdPost.blogId,
      blogName: createdPost.blogName,
      createdAt: new Date(createdPost.createdAt).toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async remove(id: string) {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      return false;
    }
    return await this.postsRepository.delete(id);
  }

  async createPostForBlog(blogId: string, newPost: CreateNewPostForGivenBlogId) {
    const blog = await this.blogsRepository.getBlogById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }

    const post = {
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };

    const createdPost = await this.postsRepository.save(post);

    return {
      id: createdPost.id,
      title: createdPost.title,
      shortDescription: createdPost.shortDescription,
      content: createdPost.content,
      blogId: createdPost.blogId,
      blogName: createdPost.blogName,
      createdAt: new Date(createdPost.createdAt).toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
  }

  async findOne(id: string) {
    return await this.postsRepository.findById(id);
  }

  async update(id: string, updateModel: UpdatePostsData): Promise<boolean> {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return await this.postsRepository.update(id, {
      title: updateModel.title,
      shortDescription: updateModel.shortDescription,
      content: updateModel.content,
      blogId: updateModel.blogId,
    });
  }

  async deleteAll(): Promise<boolean> {
    return await this.postsRepository.deleteAll();
  }

  async setLikeStatus(
    postId: string,
    userId: string,
    login: string,
    status: string,
  ): Promise<void> {
    const post = await this.postsRepository.findById(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    await this.postLikesRepository.setLikeStatus(postId, userId, login, status);
  }

  async deleteAllLikes(): Promise<void> {
    await this.postLikesRepository.deleteAll();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../blogs/repository/blogs.repository';
import { PostsRepository } from '../repository/posts.repository';
import {
  CreateNewPost,
  CreateNewPostForGivenBlogId,
  UpdatePostsData,
} from '../dto/input/create-new-post.model';
import { Posts } from '../domain/posts.entity';
import { Blog } from '../../blogs/domain/blog.entity';
import { PostLikeRepository } from '../repository/post-like.repository';
import { LikeStatus } from '../dto/input/like-status.model';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly postLikeRepository: PostLikeRepository,
  ) {}

  async create(data: CreateNewPost): Promise<Posts> {
    console.log('create new data = ', data);

    const blog = await this.blogsRepository.getBlogById(data.blogId);

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${data.blogId}  not found`);
    }
    const publishedAt = new Date().toISOString();

    const createBlogDto: {
      createdAt: string;
      blogName: string;
      extendedLikesInfo: {
        likesCount: number;
        newestLikes: { addedAt: string; login: string; userId: string }[];
        dislikesCount: number;
        myStatus: string;
      };
      shortDescription: string;
      title: string;
      blogId: string;
      content: string;
    } = {
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      blogId: data.blogId,
      blogName: 'string',
      createdAt: publishedAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };

    const createdPostId = await this.postsRepository.save(createBlogDto);
    return createdPostId;
  }

  async remove(id: string) {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      return false;
    }
    return await this.postsRepository.delete(id);
  }

  async createPostForBlog(
    blogId: string,
    newPost: CreateNewPostForGivenBlogId,
  ) {
    const blog: Blog | null = await this.blogsRepository.getBlogById(blogId);
    console.log('blog = ', blog);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }

    const publishedAt = new Date().toISOString();

    const post: {
      createdAt: string;
      blogName: string;
      extendedLikesInfo: {
        likesCount: number;
        newestLikes: { addedAt: string; login: string; userId: string }[];
        dislikesCount: number;
        myStatus: string;
      };
      shortDescription: string;
      title: string;
      blogId: string;
      content: string;
    } = {
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: publishedAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };

    const createdPost = await this.postsRepository.save(post);

    console.log('createdPost!!!!!!!!!!!! = ', createdPost);
    return createdPost;
  }

  async findOne(id: string): Promise<Posts | null> {
    const newVar = await this.postsRepository.findById(id);
    return newVar;
  }

  async update(id: string, updateModel: UpdatePostsData): Promise<number> {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    post.title = updateModel.title;
    post.shortDescription = updateModel.shortDescription;
    post.content = updateModel.content;
    post.blogId = updateModel.blogId;

    await this.postsRepository.update(id, post);
    return 100;
  }
  async deleteAll(): Promise<boolean> {
    const result = await this.postsRepository.deleteAll();
    console.log(result);
    return result;
  }

  async setLikeStatus(
    postId: string,
    userId: string,
    login: string,
    status: LikeStatus,
  ): Promise<void> {
    const post = await this.postsRepository.findById(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    await this.postLikeRepository.setLikeStatus(postId, userId, login, status);
  }
}

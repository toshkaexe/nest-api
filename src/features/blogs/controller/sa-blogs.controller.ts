import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { BlogsService } from '../service/blogs.service';
import { CreateBlogModel } from '../dto/input/create-blog.model';
import {
  PaginationOutput,
  PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/model/pagination.base.model';
import { BlogsSqlQueryRepository } from '../repository/blogs.sql-query-repository';
import { BlogOutputModel } from '../dto/output/blog.output.model';
import { SortingPropertiesType } from '../../../base/model/sorting-properies.types';
import { CreateNewPostForGivenBlogId } from '../../posts/dto/input/create-new-post.model';
import { PostsService } from '../../posts/service/posts.service';
import { OutputPostModel } from '../../posts/dto/output/posts.output.model';
import { PostsSqlQueryRepository } from '../../posts/repository/posts.sql-query-repository';
import { POSTS_SORTING_PROPERTIES } from '../../posts/controller/posts.controller';

export const SA_BLOGS_SORTING_PROPERTIES: SortingPropertiesType<BlogOutputModel> =
  ['name', 'description', 'websiteUrl', 'createdAt'];

@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class SaBlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsSqlQueryRepository,
    private readonly postsQueryRepository: PostsSqlQueryRepository,
  ) {}

  @HttpCode(201)
  @Post()
  create(
    @Body(new ValidationPipe({ transform: true }))
    createBlogDto: CreateBlogModel,
  ) {
    return this.blogsService.create(createBlogDto);
  }

  @HttpCode(200)
  @Get()
  async findAll(
    @Query() query: any,
  ): Promise<PaginationOutput<BlogOutputModel>> {
    const pagination = new PaginationWithSearchLoginAndEmailTerm(
      query,
      SA_BLOGS_SORTING_PROPERTIES,
    );
    return await this.blogsQueryRepository.getAll(pagination);
  }

  @HttpCode(204)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateBlogDto: CreateBlogModel,
  ) {
    const blog = await this.blogsService.findBlogById(id);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    await this.blogsService.update(id, updateBlogDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteResult = await this.blogsService.remove(id);
    if (!deleteResult) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
  }

  @HttpCode(201)
  @Post(':blogId/posts')
  createPostForBlog(
    @Param('blogId') blogId: string,
    @Body(new ValidationPipe({ transform: true }))
    newPost: CreateNewPostForGivenBlogId,
  ) {
    return this.postsService.createPostForBlog(blogId, newPost);
  }

  @HttpCode(200)
  @Get(':blogId/posts')
  async getPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() query: any,
    @Request() req: any,
  ): Promise<PaginationOutput<OutputPostModel>> {
    const pagination = new PaginationWithSearchLoginAndEmailTerm(
      query,
      POSTS_SORTING_PROPERTIES,
    );

    const blog = await this.blogsService.findBlogById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }

    return await this.postsQueryRepository.getPostsForBlog(
      blogId,
      pagination,
      null,
    );
  }

  @HttpCode(204)
  @Put(':blogId/posts/:postId')
  async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body(new ValidationPipe({ transform: true }))
    updatePostDto: CreateNewPostForGivenBlogId,
  ) {
    const blog = await this.blogsService.findBlogById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }

    const updateResult = await this.postsService.update(postId, {
      title: updatePostDto.title,
      shortDescription: updatePostDto.shortDescription,
      content: updatePostDto.content,
      blogId: blogId,
    });
    if (!updateResult) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
  }

  @HttpCode(204)
  @Delete(':blogId/posts/:postId')
  async deletePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    const blog = await this.blogsService.findBlogById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }

    const deleteResult = await this.postsService.remove(postId);
    if (!deleteResult) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
  }
}

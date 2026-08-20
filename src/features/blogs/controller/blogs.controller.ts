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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { BlogsService } from '../service/blogs.service';
import { CreateBlogModel } from '../dto/input/create-blog.model';
import { ApiTags } from '@nestjs/swagger';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
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

export const BLOGS_SORTING_PROPERTIES: SortingPropertiesType<BlogOutputModel> =
  ['name', 'description', 'websiteUrl', 'createdAt'];

@ApiTags('Blogs')
@Controller('blogs')
@UseInterceptors(LoggingInterceptor)
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogsQueryRepository: BlogsSqlQueryRepository,
    private readonly postsQueryRepository: PostsSqlQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
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
    const pagination: PaginationWithSearchLoginAndEmailTerm =
      new PaginationWithSearchLoginAndEmailTerm(
        query,
        BLOGS_SORTING_PROPERTIES,
      );

    return await this.blogsQueryRepository.getAll(pagination);
  }

  @Get(':id')
  @HttpCode(200)
  async getBlogByID(@Param('id') id: string) {
    const blog = await this.blogsService.findBlogById(id);

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    return {
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date(blog.createdAt).toISOString(),
      isMembership: blog.isMembership,
    };
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateBlogDto: CreateBlogModel,
  ) {
    const blog = await this.blogsService.findBlogById(id);
    if (!blog) {
      throw new NotFoundException(`Couldn't update Blog with ID ${id}`);
    }

    await this.blogsService.update(id, updateBlogDto);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':blogId')
  async remove(@Param('blogId') blogId: string) {
    const deleteResult = await this.blogsService.remove(blogId);
    if (!deleteResult) {
      throw new NotFoundException(`Couldn't delete Blog with ID ${blogId}`);
    }
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  @Post(':blogId/posts')
  createPostForBlog(
    @Param('blogId') blogId: string,
    @Body(new ValidationPipe({ transform: true }))
    newPost: CreateNewPostForGivenBlogId,
  ) {
    return this.postsService.createPostForBlog(blogId, newPost);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(200)
  @Get(':blogId/posts')
  async getPostsForBlog(
    @Param('blogId') blogId: string,
    @Query() query: any,
    @Request() req: any,
  ): Promise<PaginationOutput<OutputPostModel>> {
    const userId = req.user?.userId || null;
    const pagination = new PaginationWithSearchLoginAndEmailTerm(
      query,
      POSTS_SORTING_PROPERTIES,
    );

    const blog = await this.blogsService.findBlogById(blogId);
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found`);
    }

    return await this.postsQueryRepository.getPostsForBlog(blogId, pagination, userId);
  }
}

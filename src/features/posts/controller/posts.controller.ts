import { ApiTags } from '@nestjs/swagger';
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
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';
import { PostsService } from '../service/posts.service';
import {
  CreateNewPost,
  UpdatePostsData,
} from '../dto/input/create-new-post.model';
import {
  PaginationOutput,
  PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/model/pagination.base.model';

import { OutputPostModel } from '../dto/output/posts.output.model';
import { SortingPropertiesType } from '../../../base/model/sorting-properies.types';
import { PostsQueryRepository } from '../repository/posts.query-repository';
import { Posts } from '../domain/posts.entity';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { CreateCommentModel } from '../../comments/dto/input/create-comment.model';
import { CreateCommentCommand } from '../../comments/use-cases/create-comment.use-case';
import { CommentsQueryRepository } from '../../comments/repository/comments.query-repository';
import { CommentOutputModel } from '../../comments/dto/output/comment.output.model';
import { LikeStatusModel } from '../dto/input/like-status.model';

export const POSTS_SORTING_PROPERTIES: SortingPropertiesType<OutputPostModel> =
  ['title'];

@ApiTags('Posts')
@Controller('posts')
@UseInterceptors(LoggingInterceptor)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  @Post()
  create(
    @Body(new ValidationPipe({ transform: true })) newPost: CreateNewPost,
  ) {
    return this.postsService.create(newPost);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() query: any,
    @Request() req: any,
  ): Promise<PaginationOutput<OutputPostModel>> {
    const userId = req.user?.userId || null;
    const pagination: PaginationWithSearchLoginAndEmailTerm =
      new PaginationWithSearchLoginAndEmailTerm(
        query,
        POSTS_SORTING_PROPERTIES,
      );

    const posts: PaginationOutput<OutputPostModel> =
      await this.postsQueryRepository.getAll(pagination, userId);

    return posts;
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    const deleteResult = await this.postsService.remove(id);
    if (!deleteResult) {
      throw new NotFoundException(`Couldn't delete Post with ID ${id}`);
    }
  }
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any): Promise<OutputPostModel> {
    const userId = req.user?.userId || null;
    const post = await this.postsQueryRepository.getById(id, userId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updatePostDto: UpdatePostsData,
  ) {
    const updateResult = await this.postsService.update(id, updatePostDto);

    if (!updateResult) {
      throw new NotFoundException(`Couldn't update Post with ID ${id}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post(':postId/comments')
  async createComment(
    @Param('postId') postId: string,
    @Body(new ValidationPipe({ transform: true })) body: CreateCommentModel,
    @Request() req: any,
  ): Promise<CommentOutputModel> {
    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const commentId = await this.commandBus.execute(
      new CreateCommentCommand(
        postId,
        body.content,
        req.user.userId,
        req.user.login,
      ),
    );

    const comment = await this.commentsQueryRepository.getById(
      commentId,
      req.user.userId,
    );
    return comment!;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(200)
  @Get(':postId/comments')
  async getComments(
    @Param('postId') postId: string,
    @Query() query: any,
    @Request() req: any,
  ): Promise<PaginationOutput<CommentOutputModel>> {
    const post = await this.postsService.findOne(postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const userId = req.user?.userId || null;
    const pagination = new PaginationWithSearchLoginAndEmailTerm(
      query,
      POSTS_SORTING_PROPERTIES,
    );

    return this.commentsQueryRepository.getCommentsForPost(
      postId,
      pagination,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':postId/like-status')
  async setLikeStatus(
    @Param('postId') postId: string,
    @Body(new ValidationPipe({ transform: true })) body: LikeStatusModel,
    @Request() req: any,
  ): Promise<void> {
    await this.postsService.setLikeStatus(
      postId,
      req.user.userId,
      req.user.login,
      body.likeStatus,
    );
  }
}

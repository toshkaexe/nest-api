import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CommentsSqlQueryRepository } from '../repository/comments.sql-query-repository';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { LikeStatusModel } from '../dto/input/like-status.model';
import { CreateCommentModel } from '../dto/input/create-comment.model';
import { UpdateCommentCommand } from '../use-cases/update-comment.use-case';
import { DeleteCommentCommand } from '../use-cases/delete-comment.use-case';
import { SetLikeStatusCommand } from '../use-cases/set-like-status.use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsSqlQueryRepository,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(200)
  @Get(':id')
  async getById(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.userId || null;
    const comment = await this.commentsQueryRepository.getById(id, userId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @Body(new ValidationPipe({ transform: true })) body: CreateCommentModel,
    @Request() req: any,
  ) {
    await this.commandBus.execute(
      new UpdateCommentCommand(commentId, body.content, req.user.userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':commentId')
  async delete(@Param('commentId') commentId: string, @Request() req: any) {
    await this.commandBus.execute(
      new DeleteCommentCommand(commentId, req.user.userId),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Put(':commentId/like-status')
  async likeStatus(
    @Param('commentId') commentId: string,
    @Body(new ValidationPipe({ transform: true })) body: LikeStatusModel,
    @Request() req: any,
  ) {
    await this.commandBus.execute(
      new SetLikeStatusCommand(commentId, req.user.userId, body.likeStatus),
    );
  }
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsSqlRepository } from '../repository/comments.sql-repository';

export class UpdateCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly content: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsSqlRepository) {}

  async execute(command: UpdateCommentCommand): Promise<void> {
    const comment = await this.commentsRepository.findById(command.commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.userId !== command.userId) {
      throw new ForbiddenException();
    }
    await this.commentsRepository.updateContent(
      command.commentId,
      command.content,
    );
  }
}

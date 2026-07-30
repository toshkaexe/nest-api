import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';

export class DeleteCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const comment = await this.commentsRepository.findById(command.commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.commentatorInfo.userId !== command.userId) {
      throw new ForbiddenException();
    }
    await this.commentsRepository.delete(command.commentId);
  }
}

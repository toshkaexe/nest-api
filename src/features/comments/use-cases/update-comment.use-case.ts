import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';

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
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand): Promise<void> {
    const comment = await this.commentsRepository.findById(command.commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.commentatorInfo.userId !== command.userId) {
      throw new ForbiddenException();
    }
    await this.commentsRepository.updateContent(
      command.commentId,
      command.content,
    );
  }
}

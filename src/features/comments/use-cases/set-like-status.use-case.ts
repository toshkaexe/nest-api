import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';

export class SetLikeStatusCommand {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
    public readonly likeStatus: string,
  ) {}
}

@CommandHandler(SetLikeStatusCommand)
export class SetLikeStatusUseCase
  implements ICommandHandler<SetLikeStatusCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: SetLikeStatusCommand): Promise<void> {
    const comment = await this.commentsRepository.findById(command.commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentsRepository.setLikeStatus(
      command.commentId,
      command.userId,
      command.likeStatus,
    );
  }
}

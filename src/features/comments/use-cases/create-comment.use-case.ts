import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../repository/comments.repository';

export class CreateCommentCommand {
  constructor(
    public readonly postId: string,
    public readonly content: string,
    public readonly userId: string,
    public readonly userLogin: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const newComment = {
      postId: command.postId,
      content: command.content,
      commentatorInfo: {
        userId: command.userId,
        userLogin: command.userLogin,
      },
      likesInfo: { likesCount: 0, dislikesCount: 0 },
      createdAt: new Date(),
    };

    return this.commentsRepository.create(newComment);
  }
}

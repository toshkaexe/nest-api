import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsSqlRepository } from '../repository/comments.sql-repository';

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
  constructor(private readonly commentsRepository: CommentsSqlRepository) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    return this.commentsRepository.create({
      postId: command.postId,
      content: command.content,
      userId: command.userId,
      userLogin: command.userLogin,
      createdAt: new Date().toISOString(),
    });
  }
}

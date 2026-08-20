import { Injectable } from '@nestjs/common';
import { CommentsSqlRepository } from '../repository/comments.sql-repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsSqlRepository) {}

  async deleteAll(): Promise<boolean> {
    return this.commentsRepository.deleteAll();
  }
}

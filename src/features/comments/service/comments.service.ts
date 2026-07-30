import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsRepository } from '../repository/comments.repository';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createComment(
    postId: string,
    content: string,
    userId: string,
    userLogin: string,
  ): Promise<string> {
    const newComment = {
      postId,
      content,
      commentatorInfo: { userId, userLogin },
      likesInfo: { likesCount: 0, dislikesCount: 0 },
      createdAt: new Date(),
    };

    return this.commentsRepository.create(newComment);
  }

  async updateComment(
    commentId: string,
    content: string,
    userId: string,
  ): Promise<void> {
    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenException();
    }
    await this.commentsRepository.updateContent(commentId, content);
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.commentatorInfo.userId !== userId) {
      throw new ForbiddenException();
    }
    await this.commentsRepository.delete(commentId);
  }

  async setLikeStatus(
    commentId: string,
    userId: string,
    likeStatus: string,
  ): Promise<void> {
    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentsRepository.setLikeStatus(commentId, userId, likeStatus);
  }

  async deleteAll(): Promise<boolean> {
    return this.commentsRepository.deleteAll();
  }
}

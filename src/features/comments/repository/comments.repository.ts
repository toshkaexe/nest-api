import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import {
  CommentLike,
  CommentLikeModelType,
} from '../domain/comment-like.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
    @InjectModel(CommentLike.name)
    private commentLikeModel: CommentLikeModelType,
  ) {}

  async create(data: any): Promise<string> {
    const result = await this.commentModel.insertMany([data]);
    return result[0]._id.toString();
  }

  async findById(id: string) {
    return this.commentModel.findById(id);
  }

  async updateContent(id: string, content: string): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { _id: id },
      { $set: { content } },
    );
    return result.matchedCount === 1;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.commentModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async deleteAll(): Promise<boolean> {
    await this.commentModel.deleteMany({});
    await this.commentLikeModel.deleteMany({});
    return true;
  }

  async findUserLikeStatus(
    commentId: string,
    userId: string,
  ): Promise<string> {
    const like = await this.commentLikeModel.findOne({ commentId, userId });
    return like ? like.status : 'None';
  }

  async setLikeStatus(
    commentId: string,
    userId: string,
    likeStatus: string,
  ): Promise<void> {
    const existingLike = await this.commentLikeModel.findOne({
      commentId,
      userId,
    });

    const oldStatus = existingLike ? existingLike.status : 'None';

    if (oldStatus === likeStatus) return;

    if (likeStatus === 'None') {
      await this.commentLikeModel.deleteOne({ commentId, userId });
    } else if (existingLike) {
      existingLike.status = likeStatus;
      await existingLike.save();
    } else {
      await this.commentLikeModel.create({ commentId, userId, status: likeStatus });
    }

    const likesCountDelta =
      (likeStatus === 'Like' ? 1 : 0) - (oldStatus === 'Like' ? 1 : 0);
    const dislikesCountDelta =
      (likeStatus === 'Dislike' ? 1 : 0) - (oldStatus === 'Dislike' ? 1 : 0);

    await this.commentModel.updateOne(
      { _id: commentId },
      {
        $inc: {
          'likesInfo.likesCount': likesCountDelta,
          'likesInfo.dislikesCount': dislikesCountDelta,
        },
      },
    );
  }
}

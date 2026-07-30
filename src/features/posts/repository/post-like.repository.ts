import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostLike, PostLikeModelType } from '../domain/post-like.entity';
import { LikeStatus } from '../dto/input/like-status.model';

@Injectable()
export class PostLikeRepository {
  constructor(
    @InjectModel(PostLike.name) private postLikeModel: PostLikeModelType,
  ) {}

  async setLikeStatus(
    postId: string,
    userId: string,
    login: string,
    status: LikeStatus,
  ): Promise<void> {
    if (status === LikeStatus.None) {
      // Remove like/dislike
      await this.postLikeModel.deleteOne({ postId, userId });
    } else {
      // Upsert like/dislike
      await this.postLikeModel.updateOne(
        { postId, userId },
        {
          $set: {
            postId,
            userId,
            login,
            status,
            addedAt: new Date(),
          },
        },
        { upsert: true },
      );
    }
  }

  async findUserLikeForPost(
    postId: string,
    userId: string,
  ): Promise<PostLike | null> {
    return this.postLikeModel.findOne({ postId, userId });
  }

  async getLikesCount(postId: string): Promise<number> {
    return this.postLikeModel.countDocuments({
      postId,
      status: LikeStatus.Like,
    });
  }

  async getDislikesCount(postId: string): Promise<number> {
    return this.postLikeModel.countDocuments({
      postId,
      status: LikeStatus.Dislike,
    });
  }

  async getNewestLikes(postId: string, limit: number = 3): Promise<PostLike[]> {
    return this.postLikeModel
      .find({ postId, status: LikeStatus.Like })
      .sort({ addedAt: -1 })
      .limit(limit)
      .lean();
  }
}

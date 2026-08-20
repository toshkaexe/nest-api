import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import {
  CommentLike,
  CommentLikeModelType,
} from '../domain/comment-like.entity';
import { CommentOutputModel } from '../dto/output/comment.output.model';
import {
  PaginationOutput,
  PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/model/pagination.base.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: CommentModelType,
    @InjectModel(CommentLike.name)
    private commentLikeModel: CommentLikeModelType,
  ) {}

  async getById(
    id: string,
    userId?: string | null,
  ): Promise<CommentOutputModel | null> {
    const comment = await this.commentModel.findById(id);
    if (!comment) return null;

    const myStatus = userId
      ? await this.getUserLikeStatus(id, userId)
      : 'None';

    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      createdAt: comment.createdAt.toISOString(),
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: myStatus || 'None',
      },
    };
  }

  async getCommentsForPost(
    postId: string,
    pagination: PaginationWithSearchLoginAndEmailTerm,
    userId?: string | null,
  ): Promise<PaginationOutput<CommentOutputModel>> {
    const filter = { postId };

    const comments = await this.commentModel
      .find(filter)
      .sort({
        [pagination.sortBy]: pagination.getSortDirectionInNumericFormat(),
      })
      .skip(pagination.getSkipItemsCount())
      .limit(pagination.pageSize);

    const totalCount = await this.commentModel.countDocuments(filter);

    const mappedComments = await Promise.all(
      comments.map(async (comment) => {
        const myStatus = userId
          ? await this.getUserLikeStatus(comment._id.toString(), userId)
          : 'None';
        return {
          id: comment._id.toString(),
          content: comment.content,
          commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
          },
          createdAt: comment.createdAt.toISOString(),
          likesInfo: {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: myStatus || 'None',
          },
        };
      }),
    );

    return new PaginationOutput<CommentOutputModel>(
      mappedComments,
      pagination.pageNumber,
      pagination.pageSize,
      totalCount,
    );
  }

  private async getUserLikeStatus(
    commentId: string,
    userId: string,
  ): Promise<string> {
    const like = await this.commentLikeModel.findOne({ commentId, userId });
    return like ? like.status : 'None';
  }
}

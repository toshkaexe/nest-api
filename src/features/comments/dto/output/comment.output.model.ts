import { CommentDocument } from '../../domain/comment.entity';

export type CommentOutputModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};

export const commentMapper = (
  comment: CommentDocument,
  userId?: string | null,
  userLikeStatus?: string,
): CommentOutputModel => {
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
      myStatus: userLikeStatus || 'None',
    },
  };
};

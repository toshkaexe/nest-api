import { IsEnum, IsNotEmpty } from 'class-validator';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class LikeStatusModel {
  @IsNotEmpty()
  @IsEnum(LikeStatus, {
    message: 'likeStatus must be one of: None, Like, Dislike',
  })
  likeStatus: LikeStatus;
}

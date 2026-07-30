import { IsString, IsIn } from 'class-validator';

export class LikeStatusModel {
  @IsString()
  @IsIn(['None', 'Like', 'Dislike'])
  likeStatus: string;
}

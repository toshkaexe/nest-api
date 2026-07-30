import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCommentModel {
  @IsString()
  @MinLength(20)
  @MaxLength(300)
  content: string;
}

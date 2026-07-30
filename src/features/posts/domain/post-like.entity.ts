import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LikeStatus } from '../dto/input/like-status.model';

@Schema()
export class PostLike {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, enum: Object.values(LikeStatus), required: true })
  status: LikeStatus;

  @Prop({ type: Date, default: new Date() })
  addedAt: Date;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
PostLikeSchema.loadClass(PostLike);

export type PostLikeDocument = HydratedDocument<PostLike>;
export type PostLikeModelType = Model<PostLikeDocument>;

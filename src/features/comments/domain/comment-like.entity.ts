import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

@Schema()
export class CommentLike {
  @Prop({ type: String, required: true })
  commentId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, enum: ['None', 'Like', 'Dislike'], required: true })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);
CommentLikeSchema.loadClass(CommentLike);

CommentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export type CommentLikeDocument = HydratedDocument<CommentLike> & {
  _id: Types.ObjectId;
};
export type CommentLikeModelType = Model<CommentLikeDocument>;

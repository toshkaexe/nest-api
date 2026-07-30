import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

@Schema({ _id: false })
export class CommentatorInfo {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  userLogin: string;
}

@Schema({ _id: false })
export class CommentLikesInfo {
  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount: number;
}

@Schema()
export class Comment {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: CommentatorInfo, required: true })
  commentatorInfo: CommentatorInfo;

  @Prop({ type: CommentLikesInfo, default: { likesCount: 0, dislikesCount: 0 } })
  likesInfo: CommentLikesInfo;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.loadClass(Comment);

CommentSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export type CommentDocument = HydratedDocument<Comment> & {
  _id: Types.ObjectId;
};
export type CommentModelType = Model<CommentDocument>;

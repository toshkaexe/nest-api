import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, Model, Types} from 'mongoose';
import { NamesList } from "../output/posts.output.model";

// Define the schema for the nested object
@Schema({ _id: false })
export class NamesListSchema {
    @Prop({ type: String, required: true })
    addedAt: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true })
    login: string;
}

@Schema({ _id: false })
export class ExtendedLikesInfo {
    @Prop({ type: Number, required: true })
    likesCount: number;

    @Prop({ type: Number, required: true })
    dislikesCount: number;

    @Prop({ type: String, required: true })
    myStatus: string;

    @Prop({ type: [NamesListSchema], required: true })
    newestLikes: NamesList[];
}

export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo);
ExtendedLikesInfoSchema.loadClass(ExtendedLikesInfo);

@Schema()
export class Posts {
    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    shortDescription: string;

    @Prop({ type: String, required: true })
    content: string;

    @Prop({ type: String, required: true })
    blogId: string;

    @Prop({ type: String, required: true })
    blogName: string;

    @Prop({ type: Date, default: Date.now, required: true })
    createdAt: Date;

    @Prop({ type: ExtendedLikesInfoSchema, required: true })
    extendedLikesInfo: ExtendedLikesInfo;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
PostsSchema.loadClass(Posts);

PostsSchema.set('toJSON', {
    virtuals: true,
    transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    },
});

export type PostsDocument = HydratedDocument<Posts> & { _id: Types.ObjectId };
export type PostsModelType = Model<PostsDocument>;
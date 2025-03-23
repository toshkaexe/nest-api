import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model} from 'mongoose';

@Schema()
export class Posts {
    @Prop({type: String, required: true})
    title: string;

    @Prop({type: String, required: true})
    shortDescription: string;

    @Prop({type: String, required: true})
    content: string;

    @Prop({type: String, required: true})
    blogId: string;

    @Prop({type: String, required: true})
    blogName: string;

    @Prop({type: Date, default: Date.now})
    createdAt: Date;

    @Prop({
        type: {
            likesCount: Number,
            dislikesCount: Number,
            myStatus: String,
            newestLikes: [
                {
                    addedAt: String,
                    userId: String,
                    login: String,
                },
            ],
        }
    })
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: string;
        newestLikes: {
            addedAt: string;
            userId: string;
            login: string;
        }[];
    };
}


export const PostsSchema = SchemaFactory.createForClass(Posts);
PostsSchema.loadClass(Posts);

export type PostsDocument = HydratedDocument<Posts>;

export type PostsModelType = Model<PostsDocument>;

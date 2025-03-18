import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model} from 'mongoose';

@Schema()
export class Posts {
    @Prop({type: String, required: true})
    title: string;

    @Prop({type: String, required: true})
    shortDescripton: string;

    @Prop({type: String, required: true})
    content: string;

}

export const PostsSchema = SchemaFactory.createForClass(Posts);
PostsSchema.loadClass(Posts);

export type PostsDocument = HydratedDocument<Posts>;

export type BlogModelType = Model<PostsDocument>;

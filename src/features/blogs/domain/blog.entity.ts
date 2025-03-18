import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model} from 'mongoose';

@Schema()
export class Blog {
    @Prop({type: String, required: true})
    name: string;

    @Prop({type: String, required: true})
    description: string;

    @Prop({type: String, required: true})
    websiteUrl: string;

    @Prop({type: String, required: true})
    createdAt: string;

    @Prop({type: Boolean, required: true})
    isMembership: boolean;

}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.loadClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument>;

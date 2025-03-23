import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model, Types} from 'mongoose';

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

BlogSchema.set('toJSON', {
    virtuals: true,
    versionKey: false, // 👈 отключает __v
    transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
    },
});
export type BlogDocument = HydratedDocument<Blog> & { _id: Types.ObjectId };

export type BlogModelType = Model<BlogDocument>;

import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Model} from 'mongoose';

@Schema()
export class User {
    @Prop({type: String, required: true})
    login: string;

    @Prop({type: String, required: true})
    password: string;

    @Prop({type: String, required: true})
    email: string;

    @Prop({type: Date, default: new Date()})
    createdAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);

// Типизация документа
export type UserDocument = HydratedDocument<User>;

type UserModelStaticType = {
    createUser: (name: string, email: string | null) => UserDocument;
};

export type UserModelType = Model<UserDocument>; //& UserModelStaticType;

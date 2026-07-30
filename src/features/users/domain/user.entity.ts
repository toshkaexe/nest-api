import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class User {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: String, default: null })
  confirmationCode?: string | null;

  @Prop({ type: Date, default: null })
  confirmationCodeExpiresAt?: Date | null;

  @Prop({ type: Boolean, default: false })
  isConfirmed?: boolean;

  @Prop({ type: String, default: null })
  recoveryCode?: string | null;

  @Prop({ type: Date, default: null })
  recoveryCodeExpiresAt?: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);

// Типизация документа
export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument>;

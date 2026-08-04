import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class RefreshTokenMeta {
  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: Date, required: true })
  issuedAt: Date;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Date, required: true })
  lastActiveDate: Date;
}

export const RefreshTokenMetaSchema =
  SchemaFactory.createForClass(RefreshTokenMeta);
RefreshTokenMetaSchema.loadClass(RefreshTokenMeta);

export type RefreshTokenMetaDocument = HydratedDocument<RefreshTokenMeta>;
export type RefreshTokenMetaModelType = Model<RefreshTokenMetaDocument>;

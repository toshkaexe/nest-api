// src/schemas/item.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Item extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

// src/services/item.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './item';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async createItem(name: string, description: string): Promise<Item> {
    const newItem = new this.itemModel({ name, description });
    return newItem.save();
  }

  async getAllItems(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }
}

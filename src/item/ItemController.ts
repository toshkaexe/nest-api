// src/controllers/item.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ItemService } from './itemService';
import { Item } from './item';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async createItem(
    @Body('name') name: string,
    @Body('description') description: string,
  ): Promise<Item> {
    return this.itemService.createItem(name, description);
  }

  @Get()
  async getAllItems(): Promise<Item[]> {
    return this.itemService.getAllItems();
  }
}

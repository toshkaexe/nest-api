import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getUsers() {
    return [{ id: 1 }, { id: 2 }];
  }

  @Get(':id')
  getUser(@Param('id') userId: string) {
    return [{ id: 1 }, { id: 2 }].find((u) => u.id === +userId);
  }

  @Post()
  createUsers(@Body() inputModel: CreateUserInputModelType) {
    return {
      id: 12,
      name: inputModel.name,
      childrenCount: inputModel.childrenCount,
    };
  }
}

type CreateUserInputModelType = {
  name: string;
  childrenCount: number;
};

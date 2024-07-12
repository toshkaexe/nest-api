import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  @Get()
  getUsers(@Query('term') term: string) {
    return this.userService.findUsers(term);
  }

  @Get(':id')
  getUser(@Param('id') userId: string) {
    return [
      { id: 1, name: 'Dimych' },
      { id: 2, name: 'Viktor' },
    ].find((u) => u.id === +userId);
  }

  @Post()
  createUsers(@Body() inputModel: CreateUserInputModelType) {
    return {
      id: 12,
      name: inputModel.name,
      childrenCount: inputModel.childrenCount,
    };
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return;
  }

  @Put(':id')
  updateUser(
    @Param('id') userId: string,
    @Body() model: CreateUserInputModelType,
  ) {
    return {
      id: userId,
      model: model,
    };
  }

  constructor(protected userService: UserService) {}
}

type CreateUserInputModelType = {
  name: string;
  childrenCount: number;
};

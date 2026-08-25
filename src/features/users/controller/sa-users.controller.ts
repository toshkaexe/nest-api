import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BasicAuthGuard } from '../../auth/guards/basic-auth.guard';
import { UserOutputModel } from '../dto/output/user-output.model';
import { UsersService } from '../service/users.service';
import { UserCreateModel } from '../dto/input/create-user.model';
import { SortingPropertiesType } from '../../../base/model/sorting-properies.types';
import {
  PaginationOutput,
  PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/model/pagination.base.model';
import { UsersSqlQueryRepository } from '../repository/users.sql-query-repository';

export const SA_USERS_SORTING_PROPERTIES: SortingPropertiesType<UserOutputModel> =
  ['login', 'email'];

@Controller('sa/users')
@UseGuards(BasicAuthGuard)
export class SaUsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQueryRepository: UsersSqlQueryRepository,
  ) {}

  @HttpCode(200)
  @Get()
  async getAll(@Query() query: any) {
    const pagination: PaginationWithSearchLoginAndEmailTerm =
      new PaginationWithSearchLoginAndEmailTerm(
        query,
        SA_USERS_SORTING_PROPERTIES,
      );

    const users: PaginationOutput<UserOutputModel> =
      await this.usersQueryRepository.getAll(pagination);

    return users;
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) createModel: UserCreateModel,
  ): Promise<UserOutputModel | null> {
    const { login, password, email } = createModel;

    const createdUserId = await this.usersService.create(login, password, email);

    const createdUser: UserOutputModel | null =
      await this.usersQueryRepository.getById(createdUserId);

    return createdUser;
  }

  @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletingResult: boolean = await this.usersService.removeById(id);

    if (!deletingResult) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}

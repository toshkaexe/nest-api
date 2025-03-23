import {ApiTags} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Query, UseInterceptors,
} from '@nestjs/common';

import {UserOutputModel} from './models/output/user-output.model';
import {UsersService} from '../application/user.service';
import {UserCreateModel} from './models/input/create-user.model';
import {SortingPropertiesType} from '../../../base/model/sorting-properies.types';
import {
    PaginationOutput,
    PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/model/pagination.base.model';
import {UsersQueryRepository} from '../infrastucture/users.query-repository';
import {User} from "../domain/user.entity";
import {LoggingInterceptor} from "../../../common/interceptors/logging.interceptor";

export const USERS_SORTING_PROPERTIES: SortingPropertiesType<UserOutputModel> =
    ['login', 'email'];

// Tag для swagger
@ApiTags('Users')
@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly usersQueryRepository: UsersQueryRepository,
    ) {
    }

    @HttpCode(200)
    @Get()
    async getAll(
        // Для работы с query
        @Query() query: any,
    ) {
        console.log("getALL")
        const pagination: PaginationWithSearchLoginAndEmailTerm =
            new PaginationWithSearchLoginAndEmailTerm(
                query,
                USERS_SORTING_PROPERTIES,
            );

        const users: PaginationOutput<UserOutputModel> =
            await this.usersQueryRepository.getAll(pagination);

        return users;
    }

    @Post()
    async create(@Body() createModel: UserCreateModel): Promise<UserOutputModel | null> {
        console.log("posts")
        const {login, password, email} = createModel;

        const createdUserId = await this.usersService.create(
            login,
            password,
            email,
        );

        const createdUser: UserOutputModel | null =
            await this.usersQueryRepository.getById(createdUserId);

        return createdUser;
    }

    @Get(':id')
    @HttpCode(201)
    async getUserById(@Param('id') id: string) {

        // await this.usersService.create()
        console.log("getById")
    }

    // :id в декораторе говорит nest о том что это параметр
    // Можно прочитать с помощью @Param("id") и передать в property такое же название параметра
    // Если property не указать, то вернется объект @Param()
    @Delete(':id')
    // Для переопределения default статус кода https://docs.nestjs.com/controllers#status-code
    @HttpCode(204)

    async delete(@Param('id') id: string) {
        const deletingResult: boolean = await this.usersService.delete(id);

        if (!deletingResult) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }
}

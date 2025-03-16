import {Controller, Delete, HttpCode, NotFoundException, Param, UseInterceptors} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {UserOutputModel} from "../../users/api/models/output/user-output.model";
import {ApiTags} from "@nestjs/swagger";
import {LoggingInterceptor} from "../../../common/interceptors/logging.interceptor";
import {UsersService} from "../../users/application/user.service";
import {UsersQueryRepository} from "../../users/infrastucture/users.query-repository";


@UseInterceptors(LoggingInterceptor)
@Controller('testing/all-data')
export class TestingController {
    constructor(
        private readonly usersService: UsersService
    ) {
    }

    @Delete()
    @HttpCode(204)
    async delete() {
        const deletingResult: boolean = await this.usersService.deleteAll();

        if (!deletingResult) {
            throw new NotFoundException(`Error by deleting`);
        }
    }

}
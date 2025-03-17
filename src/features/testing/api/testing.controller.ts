import {Controller, Delete, HttpCode, NotFoundException, Param, UseInterceptors} from "@nestjs/common";

import {LoggingInterceptor} from "../../../common/interceptors/logging.interceptor";
import {UsersService} from "../../users/application/user.service";

@Controller('testing/all-data')
export class TestingController {
    constructor(
        private readonly usersService: UsersService
    ) {
    }

    @Delete()
    @HttpCode(204)
    async delete() {
       await this.usersService.deleteAll();
                 console.log('deleted all elements')

        /*        if (!deletingResult) {
                    throw new NotFoundException(`Error by deleting`);
                }*/
    }

}
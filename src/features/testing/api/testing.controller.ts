import {Controller, Delete, HttpCode, NotFoundException, Param, UseInterceptors} from "@nestjs/common";

import {UsersService} from "../../users/application/user.service";
import {BlogsService} from "../../blogs/blogs.service";

@Controller('testing/all-data')
export class TestingController {
    constructor(
        private readonly usersService: UsersService,
        private readonly blogsService: BlogsService
    ) {
    }

    @Delete()
    @HttpCode(204)
    async delete() {
        await this.usersService.deleteAll();
        await this.blogsService.deleteAll();
        console.log('deleted all elements')

        /*        if (!deletingResult) {
                    throw new NotFoundException(`Error by deleting`);
                }*/
    }

}
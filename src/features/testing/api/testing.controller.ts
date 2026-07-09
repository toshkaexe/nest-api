import {Controller, Delete, HttpCode, NotFoundException, Param, UseInterceptors} from "@nestjs/common";

import {UsersService} from "../../users/application/user.service";
import {BlogsService} from "../../blogs/service/blogs.service";
import {PostsService} from "../../posts/posts.service";

@Controller('testing/all-data')
export class TestingController {
    constructor(
        private readonly usersService: UsersService,
        private readonly blogsService: BlogsService,
        private readonly postsService: PostsService,
    ) {
    }

    @Delete()
    @HttpCode(204)
    async delete() {
        await this.usersService.deleteAll();
        await this.blogsService.deleteAll();
        await this.postsService.deleteAll();
        console.log('deleted all elements')

        /*        if (!deletingResult) {
                    throw new NotFoundException(`Error by deleting`);
                }*/
    }

}
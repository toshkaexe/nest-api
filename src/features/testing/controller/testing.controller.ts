import { Controller, Delete, HttpCode } from '@nestjs/common';

import { UsersService } from '../../users/service/users.service';
import { BlogsService } from '../../blogs/service/blogs.service';
import { PostsService } from '../../posts/service/posts.service';

@Controller('testing/all-data')
export class TestingController {
  constructor(
    private readonly usersService: UsersService,
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
  ) {}

  @Delete()
  @HttpCode(204)
  async delete() {
    await this.usersService.deleteAll();
    await this.blogsService.deleteAll();
    await this.postsService.deleteAll();
    console.log('deleted all elements');

    /*        if (!deletingResult) {
                    throw new NotFoundException(`Error by deleting`);
                }*/
  }
}

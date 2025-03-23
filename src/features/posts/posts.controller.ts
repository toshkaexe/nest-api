import {ApiTags} from "@nestjs/swagger";
import {Body, Controller, HttpCode, Post, UseInterceptors, ValidationPipe} from "@nestjs/common";
import {LoggingInterceptor} from "../../common/interceptors/logging.interceptor";
import {PostsService} from "./posts.service";
import {CreateBlogModel} from "../blogs/api/models/input/create-blog.model";
import {BlogsRepository} from "../blogs/infrastructura/blogs.repository";
import {CreateNewPost} from "./models/input/create-new-post.model";


@ApiTags('Posts')
@Controller('posts')
@UseInterceptors(LoggingInterceptor)
export class PostsController {
    constructor(
        private readonly postsService: PostsService,

     //   private readonly postsQueryRepository: PostsQueryRepository
    ) {
    }

    @HttpCode(201)
    @Post()
    create(
        @Body(new ValidationPipe({transform: true})) newPost: CreateNewPost,
    ) {
        return this.postsService.create(newPost);
    }

}
import {ApiTags} from "@nestjs/swagger";
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Post,
    Query,
    UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {LoggingInterceptor} from "../../common/interceptors/logging.interceptor";
import {PostsService} from "./posts.service";
import {CreateBlogModel} from "../blogs/api/models/input/create-blog.model";
import {BlogsRepository} from "../blogs/infrastructura/blogs.repository";
import {CreateNewPost} from "./models/input/create-new-post.model";
import {PaginationOutput, PaginationWithSearchLoginAndEmailTerm} from "../../base/model/pagination.base.model";
import {BlogOutputModel} from "../blogs/api/models/output/blog.output.model";

import {OutputPostModel} from "./models/output/posts.output.model";
import {SortingPropertiesType} from "../../base/model/sorting-properies.types";
import {PostsQueryRepository} from "./infrastructura/posts.query-repository";

export const POSTS_SORTING_PROPERTIES: SortingPropertiesType<OutputPostModel> =
    ['title'];

@ApiTags('Posts')
@Controller('posts')
@UseInterceptors(LoggingInterceptor)
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly postsQueryRepository: PostsQueryRepository
    ) {
    }

    @HttpCode(201)
    @Post()
    create(
        @Body(new ValidationPipe({transform: true})) newPost: CreateNewPost,
    ) {
        return this.postsService.create(newPost);
    }

    @HttpCode(200)
    @Get()
    async findAll(
        @Query() query: any): Promise<PaginationOutput<OutputPostModel>> {
        const
            pagination: PaginationWithSearchLoginAndEmailTerm =
                new PaginationWithSearchLoginAndEmailTerm(
                    query,
                    POSTS_SORTING_PROPERTIES,
                );

        const posts: PaginationOutput<OutputPostModel> =
            await this.postsQueryRepository.getAll(pagination);

        return posts;
    }
    @HttpCode(204)
    @Delete(':id')
    async deletePost(id: string) {
        const deleteResult= this.postsService.remove(id);
        if(!deleteResult){
            throw new NotFoundException(`Couldn't delete Post with ID ${id}`);

        }
    }


}
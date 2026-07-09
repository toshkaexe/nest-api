import {ApiTags} from "@nestjs/swagger";
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException, Param,
    Post, Put,
    Query,
    UseInterceptors,
    ValidationPipe
} from "@nestjs/common";
import {LoggingInterceptor} from "../../common/interceptors/logging.interceptor";
import {PostsService} from "./posts.service";
import {CreateBlogModel} from "../blogs/api/models/input/create-blog.model";
import {BlogsRepository} from "../blogs/infrastructure/blogs.repository";
import {CreateNewPost, UpdatePostsData} from "./models/input/create-new-post.model";
import {PaginationOutput, PaginationWithSearchLoginAndEmailTerm} from "../../base/model/pagination.base.model";
import {BlogOutputModel} from "../blogs/api/models/output/blog.output.model";

import {OutputPostModel} from "./models/output/posts.output.model";
import {SortingPropertiesType} from "../../base/model/sorting-properies.types";
import {PostsQueryRepository} from "./infrastructure/posts.query-repository";
import {Posts} from "./models/domain/posts.entity";

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
    async deletePost(@Param('id') id: string) {

        const deleteResult = await this.postsService.remove(id);
        if (!deleteResult) {
            throw new NotFoundException(`Couldn't delete Post with ID ${id}`);

        }
    }
    @HttpCode(200)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Posts> {
        const post = await this.postsService.findOne(id);
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return post;
    }

    @HttpCode(204)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe({ transform: true })) updatePostDto: UpdatePostsData,
    ) {
        const updateResult = await this.postsService.update(id, updatePostDto);

        if (!updateResult) {
            throw new NotFoundException(`Couldn't update Post with ID ${id}`);
        }
    }


}
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
    Query, UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import {BlogsService} from './blogs.service';
import {CreateBlogModel} from './api/models/input/create-blog.model';
import {ApiTags} from "@nestjs/swagger";
import {LoggingInterceptor} from "../../common/interceptors/logging.interceptor";
import {PaginationOutput, PaginationWithSearchLoginAndEmailTerm} from "../../base/model/pagination.base.model";
import {UserOutputModel} from "../users/api/models/output/user-output.model";
import {USERS_SORTING_PROPERTIES} from "../users/api/users.controller";
import {BlogsQueryRepository} from "./infrastructura/blog.query-repository";
import {BlogOutputModel} from "./api/models/output/blog.output.model";
import {SortingPropertiesType} from "../../base/model/sorting-properies.types";
import {Schema, Types} from "mongoose";
import {CreateNewPost, CreateNewPostForGivenBlogId} from "../posts/models/input/create-new-post.model";
import {PostsService} from "../posts/posts.service";
import {Blog} from "./domain/blog.entity";
import {OutputPostModel} from "../posts/models/output/posts.output.model";
import {POSTS_SORTING_PROPERTIES} from "../posts/posts.controller";
import {PostsQueryRepository} from "../posts/infrastructura/posts.query-repository";


export const BLOGS_SORTING_PROPERTIES: SortingPropertiesType<BlogOutputModel> =
    ['name'];

@ApiTags('Blogs')
@Controller('blogs')
@UseInterceptors(LoggingInterceptor)
export class BlogsController {
    constructor(private readonly blogsService: BlogsService,
                private readonly postsService: PostsService,
                private readonly blogsQueryRepository: BlogsQueryRepository,
                private readonly postsQueryRepository: PostsQueryRepository) {

    }

    @HttpCode(201)
    @Post()
    create(
        @Body(new ValidationPipe({transform: true})) createBlogDto: CreateBlogModel,
    ) {
        return this.blogsService.create(createBlogDto);
    }

    @HttpCode(200)
    @Get()
    async findAll(
        @Query() query: any): Promise<PaginationOutput<BlogOutputModel>> {
        const
            pagination: PaginationWithSearchLoginAndEmailTerm =
                new PaginationWithSearchLoginAndEmailTerm(
                    query,
                    BLOGS_SORTING_PROPERTIES,
                );

        const blogs: PaginationOutput<BlogOutputModel> =
            await this.blogsQueryRepository.getAll(pagination);

        return blogs;
    }


    @Get(':id')
    @HttpCode(200)
    async getBlogByID(@Param('id') id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
        const blog = await this.blogsService.findBlogById(id);

        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }

        return blog;
    }
    @HttpCode(204)
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body(new ValidationPipe({ transform: true })) updateBlogDto: CreateBlogModel,
    ) {
        const updateResult = await this.blogsService.update(id, updateBlogDto);

        if (!updateResult) {
            throw new NotFoundException(`Couldn't update Blog with ID ${id}`);
        }
    }

    @HttpCode(204)
    @Delete(':blogId')
    async remove(@Param('blogId') blogId: string) {
        const deleteResult = await this.blogsService.remove(blogId);
        if (!deleteResult) {
            throw new NotFoundException(`Couldn't delete Blog with ID ${blogId}`);
        }
    }

    @HttpCode(201)
    @Post(':blogId/posts')
    createPostForBlog(
        @Param('blogId') blogId: string,
        @Body(new ValidationPipe({ transform: true })) newPost: CreateNewPostForGivenBlogId,
    ) {
        console.log("----")
        console.log("createPostForBlog newPost = ", newPost)
        return this.postsService.createPostForBlog(blogId, newPost);
    }


    @HttpCode(200)
    @Get(':blogId/posts')
    async getPostsForBlog(
        @Param('blogId') blogId: string,
        @Query() query: any
    ): Promise<PaginationOutput<OutputPostModel>> {
        const pagination = new PaginationWithSearchLoginAndEmailTerm(query, BLOGS_SORTING_PROPERTIES);
        const posts = await this.postsQueryRepository.getPostsForBlog(blogId, pagination);

        if (!posts.items.length) {
            throw new NotFoundException(`No posts found for Blog with ID ${blogId}`);
        }

        return posts;
    }
}

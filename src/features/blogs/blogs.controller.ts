import {
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
import {BlogOutputModel} from "./api/models/output/blog.output.dto";
import {SortingPropertiesType} from "../../base/model/sorting-properies.types";

export const BLOGS_SORTING_PROPERTIES: SortingPropertiesType<BlogOutputModel> =
    ['name'];

@ApiTags('Blogs')
@Controller('blogs')
@UseInterceptors(LoggingInterceptor)
export class BlogsController {
    constructor(private readonly blogsService: BlogsService,
                private readonly blogsQueryRepository: BlogsQueryRepository) {

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

//
// @Get(':id')
// async findOne(@Param('id', ObjectIdValidationPipe) id: string) {
//   const blog = await this.blogsService.findOne(id);
//
//   if (!blog) {
//     throw new NotFoundException(`Blog with ID ${id} not found`);
//   }
//
//   return blog;
// }

    /*  @HttpCode(204)
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body(new ValidationPipe({ transform: true })) updateBlogDto: UpdateBlogDto,
    ) {
      const updateResult = await this.blogsService.update(id, updateBlogDto);

      if (!updateResult) {
        throw new NotFoundException(`Couldn't update Blog with ID ${id}`);
      }
    }*/

// @HttpCode(204)
// @Delete(':id')
// async remove(@Param('id') id: string) {
//   const deleteResult = await this.blogsService.remove(id);
//
//   if (!deleteResult) {
//     throw new NotFoundException(`Couldn't delete Blog with ID ${id}`);
//   }
// }
}

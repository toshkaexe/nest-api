import {CreateBlogModel} from "./api/models/input/create-blog.model";
import {Injectable} from "@nestjs/common";
import {BlogsRepository} from "./infrastructura/blogs.repository";
import {Blog} from "./domain/blog.entity";

@Injectable()
export class BlogsService {
    constructor(
        private readonly blogsRepository: BlogsRepository
    ) {
    }

    async create(createModel: CreateBlogModel): Promise<string> {

        const createNewBlog: Blog =
            {
                name: createModel.name,
                description: createModel.description,
                websiteUrl: createModel.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: true

            }
        const insertNewBlog = await this.blogsRepository.create(createNewBlog);
        return insertNewBlog;
    }
}

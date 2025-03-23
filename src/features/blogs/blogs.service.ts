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

    async deleteAll(): Promise<boolean> {
        const result= await this.blogsRepository.deleteAll();
        console.log(result)
        return result;
    }

    async remove(id: string): Promise<boolean> {
        return this.blogsRepository.delete(id);
    }

    async findBlogById(id: string): Promise<Blog | null> {
        return this.blogsRepository.getById(id);
    }
}

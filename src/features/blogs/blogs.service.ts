import {CreateBlogModel} from "./api/models/input/create-blog.model";
import {Injectable} from "@nestjs/common";
import {BlogsRepository} from "./infrastructura/blogs.repository";
import {Blog} from "./domain/blog.entity";
import {BlogOutputModel, BlogOutputModelMapper} from "./api/models/output/blog.output.model";

@Injectable()
export class BlogsService {
    constructor(
        private readonly blogsRepository: BlogsRepository
    ) {
    }

    async create(createModel: CreateBlogModel): Promise<Blog> {

        const createNewBlog: Blog =
            {
                name: createModel.name,
                description: createModel.description,
                websiteUrl: createModel.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: true

            }
        const savedBlog = await this.blogsRepository.save(createNewBlog);

        return savedBlog;
    }

    async deleteAll(): Promise<boolean> {
        const result= await this.blogsRepository.deleteAll();
        console.log(result)
        return result;
    }

    async remove(id: string): Promise<boolean> {
        return await this.blogsRepository.delete(id);
    }

    async findBlogById(id: string): Promise<Blog | null> {
        return await this.blogsRepository.getBlogById(id);
    }
}

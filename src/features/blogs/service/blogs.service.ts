import {CreateBlogModel} from "../api/models/input/create-blog.model";
import {Injectable, NotFoundException} from "@nestjs/common";
import {BlogsRepository} from "../infrastructure/blogs.repository";
import {Blog} from "../domain/blog.entity";
import {BlogOutputModel, BlogOutputModelMapper} from "../api/models/output/blog.output.model";
import {UpdatePostsData} from "../../posts/models/input/create-new-post.model";

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
                isMembership: false

            }
        const savedBlog = await this.blogsRepository.save(createNewBlog);

        return BlogOutputModelMapper(savedBlog);
    }

    async deleteAll(): Promise<boolean> {
        const result= await this.blogsRepository.deleteAll();
        console.log(result)
        return result;
    }

    async remove(id: string): Promise<boolean> {
        const b = await this.blogsRepository.delete(id);
        return b;
    }

    async findBlogById(id: string): Promise<Blog | null> {
        return await this.blogsRepository.getBlogById(id);
    }

    async update(id: string, updateModel: CreateBlogModel): Promise<boolean> {
        const blog = await this.blogsRepository.getBlogById(id);
        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }

        blog.name = updateModel.name;
        blog.description = updateModel.description;
        blog.websiteUrl = updateModel.websiteUrl;

        const updatedBlog = await this.blogsRepository.update(id, blog);
        return !!updatedBlog;
    }
}

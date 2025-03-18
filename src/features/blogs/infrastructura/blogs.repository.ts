import {InjectModel} from "@nestjs/mongoose";
import {User, UserModelType} from "../../users/domain/user.entity";
import {Blog, BlogModelType} from "../domain/blog.entity";
//import {CreateBlogModel} from "../api/models/input/create-blog.model";
import {Injectable, NotFoundException} from "@nestjs/common";

@Injectable()
export class BlogsRepository {

    constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {
    }

    async create(newBlog: Blog): Promise<string> {
        const insertResult = await this.BlogModel.insertMany([newBlog]);

        return insertResult[0].id;
    }

    async getById(id: string): Promise<Blog | null> {
        const blog = await this.BlogModel.findOne({_id: id});

        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }

        return blog;

    }

    async getAll(): Promise<Blog[]> {
        return this.BlogModel.find().exec();
    }

    async delete(id: string): Promise<boolean> {
        const deletingResult = await this.BlogModel.deleteOne({_id: id});
        return !deletingResult;
    }

    async update(id: string, blog: Blog): Promise<boolean> {
        const updateResult = await this.BlogModel.updateOne({_id: id}, blog);
        return !updateResult;
    }

    async deleteAll(): Promise<boolean> {
        const deleteResult = await this.BlogModel.deleteMany({});
        return !deleteResult; // Returns true if at least one document was deleted
    }
}
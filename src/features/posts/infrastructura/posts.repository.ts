import {BlogsRepository} from "../../blogs/infrastructura/blogs.repository";
import {Posts, PostsDocument, PostsModelType} from "../models/domain/posts.entity";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {NotFoundException} from "@nestjs/common";
import {CreatePostModel, OutputPostModel} from "../models/output/posts.output.model";
import {Blog, BlogDocument} from "../../blogs/domain/blog.entity";


export class PostsRepository {
    constructor(
        @InjectModel(Posts.name)
        private PostModel: Model<PostsDocument>,
        @InjectModel(Blog.name)
        private BlogModel: Model<BlogDocument>) {
    }


    async save(newPost: {
        createdAt: string;
        blogName: string;
        extendedLikesInfo: {
            likesCount: number;
            newestLikes: { addedAt: string; login: string; userId: string }[];
            dislikesCount: number;
            myStatus: string
        };
        shortDescription: string;
        title: string;
        blogId: string;
        content: string
    }): Promise<Posts> {
        const createdPost = new this.PostModel(newPost);
        return await createdPost.save();
    }


    async findById(id: string): Promise<Posts | null> {

        const post = await this.PostModel.findById(id).exec();
        if (!post) {
          return null
        }
        return post;
    }

    async deleteAll(): Promise<boolean> {
        const deleteResult = await this.PostModel.deleteMany({});
        return !deleteResult; // Returns true if at least one document was deleted
    }


    async delete(id: string) {
        const deletingResult = await this.PostModel.deleteOne({_id: id});
        return deletingResult.deletedCount > 0;

    }
    async update(id: string, body: Posts): Promise<boolean> {
        if(!Types.ObjectId.isValid(id) ) return  false;

        const blog = await this.BlogModel.findById(body.blogId);

        if (!blog){return  false;}
        const result =
            await this.PostModel.updateOne({_id: new Types.ObjectId(id)},
                {
                    $set: {
                        title: body.title,
                        shortDescription: body.shortDescription,
                        content: body.content,
                        blogId: body.blogId
                    }
                });
        return result.matchedCount === 1;
    }
}
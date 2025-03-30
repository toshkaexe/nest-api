import {BlogsRepository} from "../../blogs/infrastructura/blogs.repository";
import {Posts, PostsDocument, PostsModelType} from "../models/domain/posts.entity";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {NotFoundException} from "@nestjs/common";
import {CreatePostModel, OutputPostModel} from "../models/output/posts.output.model";


export class PostsRepository {
    constructor(
        @InjectModel(Posts.name)
        private PostModel: Model<PostsDocument>) {
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
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        return await this.PostModel.findById(id).exec();
    }

    async deleteAll(): Promise<boolean> {
        const deleteResult = await this.PostModel.deleteMany({});
        return !deleteResult; // Returns true if at least one document was deleted
    }


    static async deletePost(id: string) {

        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        /*        if (!ObjectId.isValid(id)) return false;

                try {
                    const result =
                        await this.PostModel.deleteOne({_id: new ObjectId(id)});
                    return result.deletedCount === 1;
                } catch (err) {
                    console.log("error = ", err)
                    return false
                }*/
    }


    async delete(id: string) {
        const deletingResult = await this.PostModel.deleteOne({_id: id});
        return !deletingResult;

    }
}
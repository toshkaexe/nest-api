import {BlogsRepository} from "../../blogs/infrastructura/blogs.repository";
import {Posts, PostsModelType} from "../models/domain/posts.entity";
import {InjectModel} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {NotFoundException} from "@nestjs/common";
import {CreatePostModel, OutputPostModel, postMapper} from "../models/output/posts.output.model";


export class PostsRepository {
    constructor(
        @InjectModel(Posts.name)
        private PostModel: PostsModelType) {
    }

    async save(newPost: CreatePostModel): Promise<Posts> {

        const insertResult = await this.PostModel.insertMany([newPost]);
        console.log("insertResult = ", insertResult)
        return insertResult[0].id;
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


}
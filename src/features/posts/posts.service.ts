import {Injectable, NotFoundException} from "@nestjs/common";
import {BlogsRepository} from "../blogs/infrastructura/blogs.repository";
import {PostsRepository} from "./infrastructura/posts.repository";
import {CreateNewPost} from "./models/input/create-new-post.model";
import {OutputPostModel} from "./models/output/posts.output.model";
import {Posts, PostsDocument} from "./models/domain/posts.entity";
import {Model} from "mongoose";


@Injectable()
export class PostsService {
    constructor(
        private readonly postsRepository: PostsRepository,
        private readonly blogsRepository: BlogsRepository
    ) {
    }

    async create(data: CreateNewPost): Promise<Posts> {
        console.log("create new data = ", data)

        const blog = await this.blogsRepository.getBlogById(data.blogId);

        if (!blog) {

            throw new NotFoundException(`Blog with ID ${data.blogId}  not found`);

        }
        const publishedAt = new Date().toISOString();
        const newPost: {
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
        } = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: blog.name,
            createdAt: publishedAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: [
                    {
                        addedAt: publishedAt,
                        userId: "string",
                        login: "string"
                    }
                ]
            }

        }
        const createBlogDto: {
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
        } = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: "string",
            createdAt: publishedAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: [
                    {
                        addedAt: publishedAt,
                        userId: "string",
                        login: "string"
                    }
                ]
            }
        }


        const createdPostId = await this.postsRepository.save(createBlogDto);
        return createdPostId;
    }

    async remove(id: string) {
        return await this.postsRepository.delete(id);

    }
}
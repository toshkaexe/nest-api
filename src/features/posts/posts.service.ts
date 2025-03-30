import {Injectable, NotFoundException} from "@nestjs/common";
import {BlogsRepository} from "../blogs/infrastructura/blogs.repository";
import {PostsRepository} from "./infrastructura/posts.repository";
import {CreateNewPost, CreateNewPostForGivenBlogId} from "./models/input/create-new-post.model";
import {OutputPostModel} from "./models/output/posts.output.model";
import {Posts, PostsDocument} from "./models/domain/posts.entity";
import {Model} from "mongoose";
import {Blog} from "../blogs/domain/blog.entity";


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

    async createPostForBlog(blogId: string, newPost: CreateNewPostForGivenBlogId) {
        const blog: Blog | null = await this.blogsRepository.getBlogById(blogId);
        console.log("blog = ", blog)
        if (!blog) {
            throw new NotFoundException(`Blog with ID ${blogId} not found`);
        }

        const publishedAt = new Date().toISOString();

        const post: {
            createdAt: string;
            blogName: string;
            extendedLikesInfo: {
                likesCount: number;
                newestLikes: { addedAt: string; login: string; userId: string }[];
                dislikesCount: number;
                myStatus: string;
            };
            shortDescription: string;
            title: string;
            blogId: string;
            content: string;
        } = {
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: blogId,
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
        };

        const createdPost = await this.postsRepository.save(post);

        console.log("createdPost!!!!!!!!!!!! = ", createdPost)
        return createdPost;
    }

    async findOne(id: string): Promise<Posts | null> {
        const newVar = await this.postsRepository.findById(id);
        return newVar;
    }

}
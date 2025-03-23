import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Blog, BlogModelType} from "../../blogs/domain/blog.entity";
import {PaginationOutput, PaginationWithSearchLoginAndEmailTerm} from "../../../base/model/pagination.base.model";
import {BlogOutputModel, BlogOutputModelMapper} from "../../blogs/api/models/output/blog.output.model";
import {FilterQuery} from "mongoose";
import {Posts, PostsModelType} from "../models/domain/posts.entity";
import {OutputPostModel, postMapper} from "../models/output/posts.output.model";

@Injectable()
export class PostsQueryRepository {
    constructor(@InjectModel(Posts.name) private postModel: PostsModelType) {
    }


    async getAll(
        pagination: PaginationWithSearchLoginAndEmailTerm,
    ): Promise<PaginationOutput<OutputPostModel>> {
        const filters: FilterQuery<Posts>[] = [];

        if (pagination.searchEmailTerm) {
            filters.push({
                email: {$regex: pagination.searchEmailTerm, $options: 'i'},
            });
        }

        if (pagination.searchLoginTerm) {
            filters.push({
                login: {$regex: pagination.searchLoginTerm, $options: 'i'},
            });
        }

        const filter: FilterQuery<Posts> = {};

        if (filters.length > 0) {
            filter.$or = filters;
        }

        return await this.__getResult(filter, pagination);
    }

    private async __getResult(
        filter: FilterQuery<Blog>,
        pagination: PaginationWithSearchLoginAndEmailTerm,
    ): Promise<PaginationOutput<OutputPostModel>> {
        const posts = await this.postModel
            .find(filter)
            .sort({
                [pagination.sortBy]: pagination.getSortDirectionInNumericFormat(),
            })
            .skip(pagination.getSkipItemsCount())
            .limit(pagination.pageSize);

        const totalCount = await this.postModel.countDocuments(filter);

        const mappedPosts = posts.map(postMapper);

        return new PaginationOutput<OutputPostModel>(
            mappedPosts,
            pagination.pageNumber,
            pagination.pageSize,
            totalCount,
        );
    }
}

import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {FilterQuery, Model} from "mongoose";
import {Posts, PostsDocument, PostsModelType} from "../models/domain/posts.entity";
import {PaginationOutput, PaginationWithSearchLoginAndEmailTerm} from "../../../base/model/pagination.base.model";
import {OutputPostModel, postMapper} from "../models/output/posts.output.model";

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectModel(Posts.name) private postModel: Model<PostsDocument>
    ) {}

    async getAll(
        pagination: PaginationWithSearchLoginAndEmailTerm,
    ): Promise<PaginationOutput<OutputPostModel>> {
        const filter: FilterQuery<Posts> = pagination.searchNameTerm
            ? { title: { $regex: pagination.searchNameTerm, $options: 'i' } }
            : {};

        const totalCount = await this.postModel.countDocuments(filter).exec();
        const items = await this.postModel.find(filter)
            .sort({ [pagination.sortBy]: pagination.getSortDirectionInNumericFormat() })
            .skip(pagination.getSkipItemsCount())
            .limit(pagination.pageSize)
            .exec();

        const mappedItems = items.map(postMapper);

        return new PaginationOutput(mappedItems, pagination.pageNumber, pagination.pageSize, totalCount);
    }

    async getPostsForBlog(
        blogId: string,
        pagination: PaginationWithSearchLoginAndEmailTerm
    ): Promise<PaginationOutput<OutputPostModel>> {
        const filter: FilterQuery<Posts> = {blogId};

        const totalCount = await this.postModel.countDocuments(filter);
        const items = await this.postModel.find(filter)
            .sort({[pagination.sortBy]: pagination.getSortDirectionInNumericFormat()})
            .skip(pagination.getSkipItemsCount())
            .limit(pagination.pageSize)
            .exec();

        const mappedItems = items.map(postMapper);

        return new PaginationOutput(mappedItems, pagination.pageNumber, pagination.pageSize, totalCount);
    }
}
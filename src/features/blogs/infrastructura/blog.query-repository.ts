import {Injectable} from '@nestjs/common';

import {
    PaginationOutput,
    PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/model/pagination.base.model';
import {FilterQuery} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {Blog, BlogModelType} from "../domain/blog.entity";
import {BlogOutputModel, BlogOutputModelMapper} from "../api/models/output/blog.output.model";
import {UserOutputModel} from "../../users/api/models/output/user-output.model";

@Injectable()
export class BlogsQueryRepository {
    constructor(@InjectModel(Blog.name) private userModel: BlogModelType) {
    }


    async getAll(
        pagination: PaginationWithSearchLoginAndEmailTerm,
    ): Promise<PaginationOutput<BlogOutputModel>> {
        const filters: FilterQuery<Blog>[] = [];

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

        const filter: FilterQuery<Blog> = {};

        if (filters.length > 0) {
            filter.$or = filters;
        }

        return await this.__getResult(filter, pagination);
    }

    private async __getResult(
        filter: FilterQuery<Blog>,
        pagination: PaginationWithSearchLoginAndEmailTerm,
    ): Promise<PaginationOutput<BlogOutputModel>> {
        const blogs = await this.userModel
            .find(filter)
            .sort({
                [pagination.sortBy]: pagination.getSortDirectionInNumericFormat(),
            })
            .skip(pagination.getSkipItemsCount())
            .limit(pagination.pageSize);

        const totalCount = await this.userModel.countDocuments(filter);

        const mappedPosts = blogs.map(BlogOutputModelMapper);

        return new PaginationOutput<BlogOutputModel>(
            mappedPosts,
            pagination.pageNumber,
            pagination.pageSize,
            totalCount,
        );
    }
}

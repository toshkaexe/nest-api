import {InjectModel} from '@nestjs/mongoose';
import {Model, FilterQuery} from 'mongoose';
import {Blog, BlogDocument} from '../domain/blog.entity';
import {PaginationWithSearchLoginAndEmailTerm, PaginationOutput} from '../../../base/model/pagination.base.model';
import {BlogOutputModel, BlogOutputModelMapper} from '../api/models/output/blog.output.model';

export class BlogsQueryRepository {
    constructor(
        @InjectModel(Blog.name)
        private readonly BlogModel: Model<BlogDocument>
    ) {
    }

    async getAll(pagination: PaginationWithSearchLoginAndEmailTerm): Promise<PaginationOutput<BlogOutputModel>> {
        const filter: FilterQuery<Blog> = pagination.searchNameTerm
            ? {name: {$regex: pagination.searchNameTerm, $options: 'i'}}
            : {};

        const totalCount = await this.BlogModel.countDocuments(filter);
        const items = await this.BlogModel.find(filter)
            .sort({[pagination.sortBy]: pagination.getSortDirectionInNumericFormat()})
            .skip(pagination.getSkipItemsCount())
            .limit(pagination.pageSize)
            .exec();

        const mappedItems = items.map(BlogOutputModelMapper);

        return new PaginationOutput(mappedItems, pagination.pageNumber, pagination.pageSize, totalCount);
    }
}
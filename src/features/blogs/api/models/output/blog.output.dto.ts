import {BlogDocument} from "../../../domain/blog.entity";

export class BlogOutputModel {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
}


export const BlogOutputModelMapper = (blog: BlogDocument): BlogOutputModel => {

    const outputModel = new BlogOutputModel();
    outputModel.id = blog.id;
    outputModel.name = blog.name;
    outputModel.description = blog.description;
    outputModel.websiteUrl = blog.websiteUrl;
    outputModel.isMembership = blog.isMembership;

    return outputModel;
}

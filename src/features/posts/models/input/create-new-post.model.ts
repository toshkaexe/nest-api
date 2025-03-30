import {IsString, MaxLength} from 'class-validator';

export class CreateNewPost {
    @IsString()
    @MaxLength(30)
    title: string;

    @IsString()
    @MaxLength(100)
    shortDescription: string;

    @IsString()
    @MaxLength(1000)
    content: string;

    @IsString()
    blogId: string;
}

export class CreateNewPostForGivenBlogId {
    @IsString()
    @MaxLength(30)
    title: string;

    @IsString()
    @MaxLength(100)
    shortDescription: string;

    @IsString()
    @MaxLength(1000)
    content: string;

}
export class UpdatePostsData {
    @IsString()
    @MaxLength(30)
    title: string;

    @IsString()
    @MaxLength(100)
    shortDescription: string;

    @IsString()
    @MaxLength(1000)
    content: string;

    @IsString()
    blogId: string;
}
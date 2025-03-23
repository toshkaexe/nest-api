import {PostsDocument} from "../domain/posts.entity";

export type ExtendedLikesInfo = {
    likesCount: number
    dislikesCount: number
    myStatus: string
    newestLikes: NamesList[]
}

export type NamesList = {
    addedAt: string
    userId: string,
    login: string
}

export type OutputPostModel = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfo
}
export type CreatePostModel = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfo
}

export const postMapper = (post: PostsDocument): OutputPostModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt.toISOString(),
        extendedLikesInfo: {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: post.extendedLikesInfo.myStatus,
            newestLikes: post.extendedLikesInfo.newestLikes.map(like => ({
                addedAt: like.addedAt,
                userId: like.userId,
                login: like.login,
            }))
        }
    };
};
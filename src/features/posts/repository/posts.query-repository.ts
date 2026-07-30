import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Posts, PostsDocument } from '../domain/posts.entity';
import {
  PaginationOutput,
  PaginationWithSearchLoginAndEmailTerm,
} from '../../../base/model/pagination.base.model';
import { OutputPostModel, postMapper } from '../dto/output/posts.output.model';
import { PostLikeRepository } from './post-like.repository';
import { LikeStatus } from '../dto/input/like-status.model';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Posts.name) private postModel: Model<PostsDocument>,
    private postLikeRepository: PostLikeRepository,
  ) {}

  async getAll(
    pagination: PaginationWithSearchLoginAndEmailTerm,
  ): Promise<PaginationOutput<OutputPostModel>> {
    const filter: FilterQuery<Posts> = pagination.searchNameTerm
      ? { title: { $regex: pagination.searchNameTerm, $options: 'i' } }
      : {};

    const totalCount = await this.postModel.countDocuments(filter).exec();
    const items = await this.postModel
      .find(filter)
      .sort({
        [pagination.sortBy]: pagination.getSortDirectionInNumericFormat(),
      })
      .skip(pagination.getSkipItemsCount())
      .limit(pagination.pageSize)
      .exec();

    const mappedItems = items.map(postMapper);

    return new PaginationOutput(
      mappedItems,
      pagination.pageNumber,
      pagination.pageSize,
      totalCount,
    );
  }

  async getPostsForBlog(
    blogId: string,
    pagination: PaginationWithSearchLoginAndEmailTerm,
  ): Promise<PaginationOutput<OutputPostModel>> {
    const filter: FilterQuery<Posts> = { blogId };

    const totalCount = await this.postModel.countDocuments(filter);
    const items = await this.postModel
      .find(filter)
      .sort({
        [pagination.sortBy]: pagination.getSortDirectionInNumericFormat(),
      })
      .skip(pagination.getSkipItemsCount())
      .limit(pagination.pageSize)
      .exec();

    const mappedItems = items.map(postMapper);

    return new PaginationOutput(
      mappedItems,
      pagination.pageNumber,
      pagination.pageSize,
      totalCount,
    );
  }

  async getById(postId: string, userId: string | null = null): Promise<OutputPostModel | null> {
    const post = await this.postModel.findById(postId).exec();

    if (!post) {
      return null;
    }

    const likesCount = await this.postLikeRepository.getLikesCount(postId);
    const dislikesCount = await this.postLikeRepository.getDislikesCount(postId);
    const newestLikes = await this.postLikeRepository.getNewestLikes(postId, 3);

    let myStatus = LikeStatus.None;
    if (userId) {
      const userLike = await this.postLikeRepository.findUserLikeForPost(postId, userId);
      if (userLike) {
        myStatus = userLike.status;
      }
    }

    const mappedPost = postMapper(post);

    return {
      ...mappedPost,
      extendedLikesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
        newestLikes: newestLikes.map(like => ({
          addedAt: like.addedAt.toISOString(),
          userId: like.userId,
          login: like.login,
        })),
      },
    };
  }
}

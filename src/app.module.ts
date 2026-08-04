import { Module, Provider } from '@nestjs/common';

import { AppService } from './app.service';
import { UsersController } from './features/users/controller/users.controller';

import { UsersRepository } from './features/users/repository/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { AppSettings } from './settings/appSettings';
import { UsersService } from './features/users/service/users.service';
import { UsersQueryRepository } from './features/users/repository/users.query-repository';
import { User, UserSchema } from './features/users/domain/user.entity';
import { AuthService } from './features/auth/service/auth.service';
import { TestingController } from './features/testing/controller/testing.controller';
import { WelcomePageController } from './features/testing/controller/welcome-page.controller';
import { BlogsController } from './features/blogs/controller/blogs.controller';
import { BlogsRepository } from './features/blogs/repository/blogs.repository';
import { BlogsService } from './features/blogs/service/blogs.service';
import { Blog, BlogSchema } from './features/blogs/domain/blog.entity';
import { BlogsQueryRepository } from './features/blogs/repository/blogs.query-repository';
import { PostsService } from './features/posts/service/posts.service';
import { PostsController } from './features/posts/controller/posts.controller';
import { PostsRepository } from './features/posts/repository/posts.repository';
import { Posts, PostsSchema } from './features/posts/domain/posts.entity';
import { PostsQueryRepository } from './features/posts/repository/posts.query-repository';
import {
  PostLike,
  PostLikeSchema,
} from './features/posts/domain/post-like.entity';
import { PostLikeRepository } from './features/posts/repository/post-like.repository';
import { AuthController } from './features/auth/controller/auth.controller';
import { EmailService } from './features/adapter/EmailService';
import { JwtModule } from '@nestjs/jwt';
import { CommentsController } from './features/comments/controller/comments.controller';
import { CommentsService } from './features/comments/service/comments.service';
import { CommentsRepository } from './features/comments/repository/comments.repository';
import { CommentsQueryRepository } from './features/comments/repository/comments.query-repository';
import {
  Comment,
  CommentSchema,
} from './features/comments/domain/comment.entity';
import {
  CommentLike,
  CommentLikeSchema,
} from './features/comments/domain/comment-like.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { CqrsModule } from '@nestjs/cqrs';
import { SetLikeStatusUseCase } from './features/comments/use-cases/set-like-status.use-case';
import { CreateCommentUseCase } from './features/comments/use-cases/create-comment.use-case';
import { UpdateCommentUseCase } from './features/comments/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from './features/comments/use-cases/delete-comment.use-case';
import {
  RefreshTokenMeta,
  RefreshTokenMetaSchema,
} from './features/auth/domain/refresh-token-meta.entity';
import { RefreshTokenMetaRepository } from './features/auth/repository/refresh-token-meta.repository';
import { SecurityController } from './features/security/controller/security.controller';

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
];
const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsService,
  BlogsQueryRepository,
];

const postsProviders: Provider[] = [
  PostsRepository,
  PostsService,
  PostsQueryRepository,
  PostLikeRepository,
];

const commentsProviders: Provider[] = [
  CommentsRepository,
  CommentsService,
  CommentsQueryRepository,
  SetLikeStatusUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
];

@Module({
  imports: [
    MongooseModule.forRoot(
      `${AppSettings.MONGO_URI_CLOUD}/${AppSettings.DB_NANE_NEST}`,
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }]),
    MongooseModule.forFeature([
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),
    MongooseModule.forFeature([
      { name: RefreshTokenMeta.name, schema: RefreshTokenMetaSchema },
    ]),
    JwtModule.register({
      secret: AppSettings.ACCESS_JWT_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
    ThrottlerModule.forRoot([{ ttl: 10000, limit: 5 }]),
    CqrsModule.forRoot(),
  ],
  providers: [
    AppService,
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    AuthService,
    EmailService,
    RefreshTokenMetaRepository,
  ],
  controllers: [
    UsersController,
    TestingController,
    WelcomePageController,
    BlogsController,
    PostsController,
    AuthController,
    CommentsController,
    SecurityController,
  ],
})
export class AppModule {}

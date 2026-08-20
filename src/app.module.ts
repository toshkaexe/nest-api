import { Module, Provider } from '@nestjs/common';

import { AppService } from './app.service';
import { UsersController } from './features/users/controller/users.controller';
import { SaUsersController } from './features/users/controller/sa-users.controller';

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
import { SaBlogsController } from './features/blogs/controller/sa-blogs.controller';
import { BlogsSqlRepository } from './features/blogs/repository/blogs.sql-repository';
import { BlogsService } from './features/blogs/service/blogs.service';
import { BlogsSqlQueryRepository } from './features/blogs/repository/blogs.sql-query-repository';
import { PostsService } from './features/posts/service/posts.service';
import { PostsController } from './features/posts/controller/posts.controller';
import { PostsSqlRepository } from './features/posts/repository/posts.sql-repository';
import { PostsSqlQueryRepository } from './features/posts/repository/posts.sql-query-repository';
import { PostLikesSqlRepository } from './features/posts/repository/post-likes.sql-repository';
import { AuthController } from './features/auth/controller/auth.controller';
import { EmailService } from './features/adapter/EmailService';
import { JwtModule } from '@nestjs/jwt';
import { CommentsController } from './features/comments/controller/comments.controller';
import { CommentsService } from './features/comments/service/comments.service';
import { CommentsSqlRepository } from './features/comments/repository/comments.sql-repository';
import { CommentsSqlQueryRepository } from './features/comments/repository/comments.sql-query-repository';
import { CqrsModule } from '@nestjs/cqrs';
import { PostgresModule } from './database/postgres.module';
import { PgInitService } from './database/pg-init.service';
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
  BlogsSqlRepository,
  BlogsService,
  BlogsSqlQueryRepository,
];

const postsProviders: Provider[] = [
  PostsSqlRepository,
  PostsService,
  PostsSqlQueryRepository,
  PostLikesSqlRepository,
];

const commentsProviders: Provider[] = [
  CommentsSqlRepository,
  CommentsService,
  CommentsSqlQueryRepository,
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
    MongooseModule.forFeature([
      { name: RefreshTokenMeta.name, schema: RefreshTokenMetaSchema },
    ]),
    JwtModule.register({
      secret: AppSettings.ACCESS_JWT_SECRET,
      signOptions: { expiresIn: '10m' },
    }),
    CqrsModule.forRoot(),
    PostgresModule,
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
    PgInitService,
  ],
  controllers: [
    UsersController,
    SaUsersController,
    TestingController,
    WelcomePageController,
    BlogsController,
    SaBlogsController,
    PostsController,
    AuthController,
    CommentsController,
    SecurityController,
  ],
})
export class AppModule {}

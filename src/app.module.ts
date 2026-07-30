import {Module, Provider} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {AppService} from './app.service';
import {UsersController} from './features/users/controller/users.controller';

import {UsersRepository} from './features/users/repository/users.repository';
import {MongooseModule} from '@nestjs/mongoose';
import {AppSettings} from './settings/appSettings';
import {UsersService} from './features/users/service/users.service';
import {UsersQueryRepository} from "./features/users/repository/users.query-repository";
import {User, UserSchema} from "./features/users/domain/user.entity";
import {AuthService} from "./features/auth/service/auth.service";
import {TestingController} from "./features/testing/controller/testing.controller";
import {WelcomePageController} from "./features/testing/controller/welcome-page.controller";
import {BlogsController} from "./features/blogs/controller/blogs.controller";
import {BlogsRepository} from "./features/blogs/repository/blogs.repository";
import {BlogsService} from "./features/blogs/service/blogs.service";
import {Blog, BlogSchema} from "./features/blogs/domain/blog.entity";
import {BlogsQueryRepository} from "./features/blogs/repository/blogs.query-repository";
import {PostsService} from "./features/posts/service/posts.service";
import {PostsController} from "./features/posts/controller/posts.controller";
import {PostsRepository} from "./features/posts/repository/posts.repository";
import {Posts, PostsSchema} from "./features/posts/domain/posts.entity";
import {PostsQueryRepository} from "./features/posts/repository/posts.query-repository";
import {AuthController} from './features/auth/controller/auth.controller';
import {EmailService} from './features/adapter/EmailService';
import {JwtModule} from '@nestjs/jwt';
import {ThrottlerModule, ThrottlerGuard} from '@nestjs/throttler';
import {APP_GUARD} from '@nestjs/core';

const usersProviders: Provider[] = [
    UsersRepository,
    UsersService,
    UsersQueryRepository,
];
const blogsProviders: Provider[] = [
    BlogsRepository,
    BlogsService,
    BlogsQueryRepository
];

const postsProviders: Provider[] = [
    PostsRepository,
    PostsService,
    PostsQueryRepository
];

@Module({
    imports: [
        ThrottlerModule.forRoot([{
            ttl: 10000,
            limit: 5,
        }]),
        MongooseModule.forRoot(
            `${AppSettings.MONGO_URI_CLOUD}/${AppSettings.DB_NANE_NEST}`,
        ),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
        MongooseModule.forFeature([{name: Posts.name, schema: PostsSchema}]),
        JwtModule.register({
            secret: AppSettings.ACCESS_JWT_SECRET,
            signOptions: { expiresIn: '10m' },
        }),
    ],
    providers: [AppService,
        ...usersProviders,
        ...blogsProviders,
        ...postsProviders,
        AuthService,
        EmailService,
    ],
    controllers: [UsersController, TestingController, WelcomePageController, BlogsController, PostsController, AuthController],
})
export class AppModule {
}

import {Module, Provider} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import {AppService} from './app.service';
import {UsersController} from './features/users/api/users.controller';

import {UsersRepository} from './features/users/infrastucture/users.repository';
import {MongooseModule} from '@nestjs/mongoose';
import {AppSettings} from './settings/appSettings';
import {UsersService} from './features/users/application/user.service';
import {UsersQueryRepository} from "./features/users/infrastucture/users.query-repository";
import {User, UserSchema} from "./features/users/domain/user.entity";
import {AuthService} from "./features/auth/auth.service";
import {TestingController} from "./features/testing/api/testing.controller";
import {WelcomePageController} from "./features/testing/api/welkomePage.controller";
import {BlogsController} from "./features/blogs/blogs.controller";
import {BlogsRepository} from "./features/blogs/infrastructura/blogs.repository";
import {BlogsService} from "./features/blogs/blogs.service";
import {Blog, BlogSchema} from "./features/blogs/domain/blog.entity";
import {BlogsQueryRepository} from "./features/blogs/infrastructura/blog.query-repository";
import {PostsService} from "./features/posts/posts.service";
import {PostsController} from "./features/posts/posts.controller";
import {PostsRepository} from "./features/posts/infrastructura/posts.repository";
import {Posts, PostsSchema} from "./features/posts/models/domain/posts.entity";

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
];

@Module({
    imports: [
        MongooseModule.forRoot(
            `${AppSettings.MONGO_URI_CLOUD}/${AppSettings.DB_NANE_NEST}`,
        ),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}]),
        MongooseModule.forFeature([{name: Posts.name, schema: PostsSchema}]),


    ],
    providers: [AppService,
        ...usersProviders,
        ...blogsProviders,
        ...postsProviders,
        AuthService,
    ],
    controllers: [UsersController, TestingController, WelcomePageController, BlogsController, PostsController],
})
export class AppModule {
}

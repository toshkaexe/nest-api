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

const usersProviders: Provider[] = [
    UsersRepository,
    UsersService,
    UsersQueryRepository,
];

@Module({
    imports: [
        MongooseModule.forRoot(
            `${AppSettings.MONGO_URI_CLOUD}/${AppSettings.DB_NANE_NEST}`,
        ),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    providers: [AppService, ...usersProviders, AuthService,
    ],
    controllers: [UsersController, TestingController],
})
export class AppModule {
}

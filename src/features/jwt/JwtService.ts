import {ObjectId, WithId} from "mongodb";
//import {UserDbModel} from "../models/users/users-models";
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import {AppSettings} from "../../settings/appSettings";
import {User, UserDocument, UserModelType} from "../users/domain/user.entity";
import {LoginOrEmailModel} from "../auth/input/create-user.model";

const secretWord = AppSettings.ACCESS_JWT_SECRET || "test";

export class JwtService {
    async createJWT(user: UserDocument) {

        return jwt.sign(
            {userId: user._id.toString()},
            secretWord,
            {expiresIn: '2h'}
        )
    }

    async generatePasswordHash(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async comparePasswords(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

}
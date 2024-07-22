import {Injectable} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
    constructor() {
    }

    async generatePasswordHash(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }
}

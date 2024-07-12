import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(protected usersRepo: UsersRepository) {}

  findUsers(term: string) {
    return this.usersRepo.findUsers(term);
  }
}

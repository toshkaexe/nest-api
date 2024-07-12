import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor() {}
  findUsers(term: string) {
    return [
      { id: 1, name: 'Anton' },
      { id: 2, name: 'Viktor' },
    ].filter((u) => !term || u.name.indexOf(term) > -1);
  }
}

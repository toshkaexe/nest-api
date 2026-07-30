import { Injectable } from '@nestjs/common';
import { EmailModel } from '../auth/dto/login.model';

@Injectable()
export class EmailService {
  constructor() {}

  async send(email: EmailModel) {

  }
}

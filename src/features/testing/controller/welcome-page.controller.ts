import { Controller, Get, HttpCode, UseInterceptors } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { LoggingInterceptor } from '../../../common/interceptors/logging.interceptor';

@SkipThrottle()
@UseInterceptors(LoggingInterceptor)
@Controller('/')
export class WelcomePageController {
  @Get()
  @HttpCode(200)
  async getWelcomePage() {
    console.log('show welcome page');
    return '<h1>This is a welcome page, please run some request</h1>';
  }
}

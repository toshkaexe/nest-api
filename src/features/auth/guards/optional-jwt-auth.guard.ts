import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppSettings } from '../../../settings/appSettings';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      request.user = null;
      return true;
    }

    const token = authHeader.substring(7);

    try {
      request.user = this.jwtService.verify(token, {
        secret: AppSettings.ACCESS_JWT_SECRET,
      });
    } catch {
      request.user = null;
    }

    return true;
  }
}

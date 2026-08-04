import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppSettings } from '../../../settings/appSettings';
import { RefreshTokenMetaRepository } from '../../auth/repository/refresh-token-meta.repository';

@Controller('security')
export class SecurityController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenMetaRepository: RefreshTokenMetaRepository,
  ) {}

  @HttpCode(200)
  @Get('devices')
  async getDevices(@Request() req: any) {
    const payload = this.verifyRefreshToken(req);

    const sessions = await this.refreshTokenMetaRepository.findAllByUserId(
      payload.userId,
    );

    return sessions.map((s) => ({
      ip: s.ip,
      title: s.title,
      lastActiveDate: s.lastActiveDate.toISOString(),
      deviceId: s.deviceId,
    }));
  }

  @HttpCode(204)
  @Delete('devices')
  async deleteAllDevices(@Request() req: any) {
    const payload = this.verifyRefreshToken(req);

    await this.refreshTokenMetaRepository.deleteAllByUserIdExcept(
      payload.userId,
      payload.deviceId,
    );
  }

  @HttpCode(204)
  @Delete('devices/:deviceId')
  async deleteDevice(
    @Param('deviceId') deviceId: string,
    @Request() req: any,
  ) {
    const payload = this.verifyRefreshToken(req);

    const session = await this.refreshTokenMetaRepository.findByDeviceId(deviceId);

    if (!session) {
      throw new NotFoundException('Device not found');
    }

    if (session.userId !== payload.userId) {
      throw new ForbiddenException('Not your device');
    }

    await this.refreshTokenMetaRepository.deleteByDeviceId(deviceId);
  }

  private verifyRefreshToken(req: any): any {
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new UnauthorizedException('No refresh token');
    }

    try {
      return this.jwtService.verify(token, {
        secret: AppSettings.REFRESH_JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

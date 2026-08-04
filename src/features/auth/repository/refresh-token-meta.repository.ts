import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshTokenMeta,
  RefreshTokenMetaModelType,
  RefreshTokenMetaDocument,
} from '../domain/refresh-token-meta.entity';

@Injectable()
export class RefreshTokenMetaRepository {
  constructor(
    @InjectModel(RefreshTokenMeta.name)
    private refreshTokenMetaModel: RefreshTokenMetaModelType,
  ) {}

  async create(data: {
    deviceId: string;
    userId: string;
    ip: string;
    title: string;
    issuedAt: Date;
    expiresAt: Date;
    lastActiveDate: Date;
  }): Promise<void> {
    await this.refreshTokenMetaModel.create(data);
  }

  async findByDeviceIdAndIssuedAt(
    deviceId: string,
    issuedAt: Date,
  ): Promise<RefreshTokenMetaDocument | null> {
    return this.refreshTokenMetaModel.findOne({ deviceId, issuedAt });
  }

  async findByDeviceId(
    deviceId: string,
  ): Promise<RefreshTokenMetaDocument | null> {
    return this.refreshTokenMetaModel.findOne({ deviceId });
  }

  async findAllByUserId(userId: string): Promise<RefreshTokenMetaDocument[]> {
    return this.refreshTokenMetaModel.find({ userId });
  }

  async updateSession(
    deviceId: string,
    newIssuedAt: Date,
    newExpiresAt: Date,
    newLastActiveDate: Date,
  ): Promise<void> {
    await this.refreshTokenMetaModel.updateOne(
      { deviceId },
      {
        $set: {
          issuedAt: newIssuedAt,
          expiresAt: newExpiresAt,
          lastActiveDate: newLastActiveDate,
        },
      },
    );
  }

  async deleteByDeviceId(deviceId: string): Promise<void> {
    await this.refreshTokenMetaModel.deleteOne({ deviceId });
  }

  async deleteAllByUserIdExcept(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    await this.refreshTokenMetaModel.deleteMany({
      userId,
      deviceId: { $ne: deviceId },
    });
  }

  async deleteAll(): Promise<void> {
    await this.refreshTokenMetaModel.deleteMany({});
  }
}

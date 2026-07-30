import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async create(newUser: User): Promise<string> {
    const insertResult = await this.UserModel.insertMany([newUser]);

    return insertResult[0].id;
  }

  async delete(id: string): Promise<boolean> {
    const deletingResult = await this.UserModel.deleteOne({ _id: id });
    return deletingResult.deletedCount === 1;
  }

  async deleteAll(): Promise<boolean> {
    const deleteResult = await this.UserModel.deleteMany({});
    return !deleteResult; // Returns true if at least one document was deleted
  }

  async updateRecoveryCode(
    userId: string,
    recoveryCode: string,
    expiresAt: Date,
  ): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { _id: userId },
      { $set: { recoveryCode, recoveryCodeExpiresAt: expiresAt } },
    );
    return result.matchedCount === 1;
  }

  async updateConfirmationCode(
    userId: string,
    confirmationCode: string,
    expiresAt: Date,
  ): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { _id: userId },
      { $set: { confirmationCode, confirmationCodeExpiresAt: expiresAt } },
    );
    return result.matchedCount === 1;
  }

  async findByConfirmationCode(code: string) {
    return this.UserModel.findOne({ confirmationCode: code });
  }

  async confirmUser(userId: string): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          isConfirmed: true,
          confirmationCode: null,
          confirmationCodeExpiresAt: null,
        },
      },
    );
    return result.matchedCount === 1;
  }

  async findByRecoveryCode(recoveryCode: string) {
    return this.UserModel.findOne({ recoveryCode });
  }

  async updatePassword(userId: string, passwordHash: string): Promise<boolean> {
    const result = await this.UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          password: passwordHash,
          recoveryCode: null,
          recoveryCodeExpiresAt: null,
        },
      },
    );
    return result.matchedCount === 1;
  }
}

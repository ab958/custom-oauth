import {
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { ICreateUser, IGetUser } from 'src/shared/interfaces';
import { DynamicException } from 'src/shared/services/exception.service';

@Injectable()
export class UserProfileService {
  private readonly logger = new Logger(UserProfileService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  async createUser(params: ICreateUser) {
    this.logger.log('In Service: Request to create User')
    const user = await this.userModel.create(params);
    return user;
  }

  async getUserByMail(params: IGetUser) {
    this.logger.log('In Service: Request to get user by mail')
    const user = await this.userModel.findOne({
      email: params.email,
    });
    if (!user) {
      throw new DynamicException('User not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserByToken(token: string) {
    this.logger.log('In Service: Request to get user by token')
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new DynamicException('User not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserById(id: string) {
    this.logger.log('In Service: Request to get user by id')
    const user = await this.userModel.findOne(
      {
        _id: id,
      },
      {},
      { lean: true },
    );
    if (!user) {
      throw new DynamicException('User not Found', HttpStatus.NOT_FOUND);
    }
    return {
      ...user,
      message: 'User retrieved Successfully'
    };
  }
}

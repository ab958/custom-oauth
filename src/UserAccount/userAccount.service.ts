import {
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserProfileService } from 'src/UserProfile/userProfile.service';
import { ICreateUser, ISignIn } from 'src/shared/interfaces';
import { DynamicException } from 'src/shared/services/exception.service';

@Injectable()
export class UserAccountService {
  public readonly logger = new Logger(UserAccountService.name);
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserProfileService,
  ) { }

  async signUp(params: ICreateUser) {
    this.logger.log('In Service: Request to signUp user')
    const { password, ...otherAttributes } = params;

    const hashedPassword = await this.hashPassword(password);
    let user;
    try {
      user = await this.userService.createUser({
        ...otherAttributes,
        password: hashedPassword,
      });
    } catch (error) {
      throw new DynamicException('User Not created', HttpStatus.NOT_FOUND);
    }

    const payload = { sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user,
      message: 'User Signup SuccessFully',
      statusCode: HttpStatus.CREATED
    };
  }

  async signIn(params: ISignIn) {
    this.logger.log('In Service: Request to signIn user')
    const { email, password } = params;
    const user = await this.userService.getUserByMail({
      email,
    });
    if (!user) {
      throw new DynamicException('User doesnot exists', HttpStatus.NOT_FOUND);
    }
    const isValid = await this.checkHashMatch(password, user.password);
    if (isValid) {
      const payload = { sub: user._id };

      return {
        access_token: this.jwtService.sign(payload),
        user,
        message: 'User login SuccessFully'
      };
    } else {
      throw new DynamicException('username or password is not valid', HttpStatus.BAD_REQUEST);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  private async checkHashMatch(
    newPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(newPassword, hashedPassword);
  }

  async verifyToken(token: string) {
    this.logger.log('In Service: Request to verify Token')
    let decoded;
    try {
      decoded = this.jwtService.verify(token, {
        secret: 'test',
      });
    } catch (err) {
      this.logger.error('Token verification failed:', err.message);
      throw err;
    }
    const user = await this.userService.getUserById(decoded.sub);
    return {
      ...decoded,
      ...user,
    };
  }
}

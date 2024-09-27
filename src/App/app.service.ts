import {
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { App } from './schemas/app.schemas';
import { Model } from 'mongoose';
import { DynamicException } from 'src/shared/services/exception.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateAppRequestDto, UpdateAppRequestDto } from 'src/shared/dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @InjectModel(App.name) private readonly appModel: Model<App>,
  ) { }

  async createApp(params: CreateAppRequestDto) {
    this.logger.log('In Service: Request to create App')

    const { name, redirectUri, userId } = params;
    const clientId = uuidv4();
    const clientSecret = uuidv4();

    const newApp = await this.appModel.create({
      clientId,
      clientSecret,
      name,
      redirectUri,
      user: userId
    });

    return {
      application: newApp,
      message: 'App Created SuccessFully'
    }
  }

  async getAllApps(userId: string) {
    this.logger.log('In Service: Request to get All Apps')
    const applications =  await this.appModel.find({ user: userId });

    if (applications.length === 0) {
      throw new DynamicException(`No App available`, HttpStatus.NOT_FOUND);
    }

    return{
      applications,
      message: 'Apps retreived SuccessFully'
    }
  }

  async getAppById(id: string) {
    this.logger.log('In Service: Request to get App By Id')
    const application = await this.appModel.findById(id);
    if (!application) {
      throw new DynamicException(`App with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return {
      application,
      message: 'App retreived SuccessFully'
    };
  }

  async updateApp(id: string, params: UpdateAppRequestDto) {
    this.logger.log('In Service: Request to update App')

    const { name, redirectUri } = params;
    const app = await this.appModel.findById( id );
    if (!app) {
      throw new DynamicException(`App with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    app.name = name;
    app.redirectUri = redirectUri;

    await this.appModel.findByIdAndUpdate(id, app);

    return{ 
      message: 'App updated SuccessFully'
    }
  }

  async deleteApp(id: string) {
    this.logger.log('In Service: Request to delete App')

    await this.appModel.findByIdAndDelete( id );

    return{ 
      message: 'App Deleted SuccessFully'
    }
  }
}

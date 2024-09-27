import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/UserProfile/schemas/user.schemas';

@Schema({
  collection: 'app',
  versionKey: false,
  timestamps: true,
})
export class App {
  @Prop({ type: String, required: true })
  clientId: string;

  @Prop({ required: true, unique: true, type: String })
  clientSecret: string;

  @Prop({ type: [String], required: true })
  redirectUri: string[];

  @Prop({ type: String, required: false })
  name: string;

  @Prop({ type:  mongoose.Schema.Types.ObjectId, required: false, ref: 'users' })
  user: User;
}

export const AppSchema = SchemaFactory.createForClass(App);

import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/UserProfile/schemas/user.schemas';
import * as mongoose from 'mongoose';

@Schema({
  collection: 'authorization_codes',
  versionKey: false,
  timestamps: true,
})
export class AuthorizationCode extends Document {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true })
  clientId: string;

  @Prop({ type: String, required: true })
  codeChallenge: string;

  @Prop({ type: String, required: true })
  codeChallengeMethod: string;

  @Prop({ type: String, required: true })
  scope: string;

  @Prop({ type:  mongoose.Schema.Types.ObjectId, required: false, ref: 'users' })
  user: User;
}

export const AuthorizationCodeSchema = SchemaFactory.createForClass(AuthorizationCode);

import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: true,
})
export class User {
  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: false })
  phoneNumber?: string;

  @Prop({ type: String, required: false })
  profileImage?: string;

  @Prop({ type: Boolean, required: true, default: true })
  isActive?: boolean;

  @Prop({ type: String, required: false })
  resetPasswordToken?: String;

  @Prop({ type: Number, required: false })
  resetPasswordExpires?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

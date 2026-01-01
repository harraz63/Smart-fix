import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Class
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, enum: ['customer', 'admin'], default: 'customer' })
  role: string;

  @Prop({ default: null })
  profilePicture: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
    address: String,
    city: String,
    governorate: String,
  })
  location: {
    type: string;
    coordinates: number[];
    address?: string;
    city?: string;
    governorate?: string;
  };

  @Prop({ default: true })
  isActive: boolean;
}

// Schema
export const userSchema = SchemaFactory.createForClass(User);
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

// Create geospatial index for location-based queries
userSchema.index({ 'location.coordinates': '2dsphere' });

// Model
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);

// Type
export type UserType = HydratedDocument<User>;

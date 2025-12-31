import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VerificationStatusEnum } from 'src/Common';

// Class
@Schema({ timestamps: true })
export class Technical {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: true })
  fullName: string;

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

  @Prop({ type: [String], required: true })
  serviceCategories: string[];

  @Prop({ type: Number, required: true })
  yearsOfExperience: number;

  @Prop({ type: String, maxlength: 500 })
  bio: string;

  @Prop({
    type: {
      nationalId: { type: String },
      nationalIdImage: { type: String },
    },
  })
  kycDocuments: {
    nationalId: string;
    nationalIdImage: string;
  };

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({
    type: String,
    enum: VerificationStatusEnum,
    default: VerificationStatusEnum.PENDING,
  })
  verificationStatus: string;

  @Prop({ type: Boolean, default: true })
  isAvailable: boolean;

  @Prop({ type: Number, default: 0 })
  averageRating: number;

  @Prop({ type: Number, default: 0 })
  totalRating: number;

  @Prop({ type: Number, default: 0 })
  totalOrders: number;
}

// Schema

export const TechnicalSchema = SchemaFactory.createForClass(Technical);

// Make hook for calculate average rating
TechnicalSchema.pre<TechnicalType>('save', function (this: TechnicalType) {
  if (this.isModified('totalRating') || this.isModified('totalOrders')) {
    this.averageRating =
      this.totalOrders > 0 ? this.totalRating / this.totalOrders : 0;
  }
});

// Model
export const TechnicalModel = MongooseModule.forFeature([
  { name: Technical.name, schema: TechnicalSchema },
]);

// Type
export type TechnicalType = HydratedDocument<Technical>;

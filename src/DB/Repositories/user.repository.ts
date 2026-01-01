import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserType } from '../Model/users/user.model';
import { Model, ProjectionType, Types } from 'mongoose';

type Filter<T> = Parameters<Model<T>['find']>[0];
type UpdateManyFilter<T> = Parameters<Model<T>['updateMany']>[0];

@Injectable()
export class UserRepository extends BaseRepository<UserType> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserType>,
  ) {
    super(userModel);
  }

  // FIND METHODS
  async findOneDocument(
    filters: Filter<UserType>,
    project?: ProjectionType<UserType>,
  ): Promise<UserType | null> {
    return await this.userModel.findOne(filters, project);
  }

  async findUserById(
    id: Types.ObjectId,
    project?: ProjectionType<UserType>,
  ): Promise<UserType | null> {
    return await this.userModel.findById(id, project);
  }

  async findUserByEmail(
    email: string,
    project?: ProjectionType<UserType>,
  ): Promise<UserType | null> {
    return await this.userModel.findOne({ email }, project);
  }

  async findUserByPhone(
    phone: string,
    project?: ProjectionType<UserType>,
  ): Promise<UserType | null> {
    return await this.userModel.findOne({ phone }, project);
  }

  async findActiveUsers(
    filters: Filter<UserType>,
    project?: ProjectionType<UserType>,
  ): Promise<UserType[]> {
    return await this.userModel.find({ ...filters, isActive: true }, project);
  }

  async findUsersNearLocation(
    longitude: number,
    latitude: number,
    maxDistanceInMeters: number,
    filters?: Filter<UserType>,
  ): Promise<UserType[]> {
    return await this.userModel.find({
      ...filters,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
        $maxDistance: maxDistanceInMeters,
      },
    });
  }

  // CHECK METHODS
  async checkUserExists(email: string, phone: string): Promise<boolean> {
    const user = await this.userModel.exists({
      $or: [{ email }, { phone }],
    });
    return !!User;
  }

  // UPDATE METHODS
  async updateProfile(
    userId: Types.ObjectId,
    data: Partial<Pick<UserType, 'fullName' | 'profilePicture'>>,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, data);
  }

  async updateUserStatus(
    userId: Types.ObjectId,
    isActive?: boolean,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { isActive });
  }

  async updateUserLocation(
    userId: Types.ObjectId,
    longitude: number,
    latitude: number,
    address?: string,
    city?: string,
    governorate?: string,
  ): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      location: {
        longitude,
        latitude,
        address,
        city,
        governorate,
      },
    });
  }
}

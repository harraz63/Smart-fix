import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserType } from '../Model/users/user.model';
import { Model, ProjectionType, Types, UpdateQuery } from 'mongoose';
import { UserModel } from './../Model/users/user.model';

type Filter<T> = Parameters<Model<T>['find']>[0];
type UpdateManyFilter<T> = Parameters<Model<T>['updateMany']>[0];

@Injectable()
export class TechnicalRepository extends BaseRepository<UserType>{
    constructor(
        @InjectModel(User.name) private readonly UserModel: Model<UserType>,
    ) {
        super(UserModel);
    }   

    //Find methods

    async findOneDocument(
        filters: Filter<UserType>,project?: ProjectionType<UserType>
    ): Promise<UserType | null> {
        return await this.UserModel.findOne(filters,project);
    }

    async findTechnicalById(
        id: Types.ObjectId, project?: ProjectionType<UserType>
    ): Promise<UserType | null> {
        return await this.UserModel.findById(id, project);
    }

    async findTechnicalByEmail(
        email: string, project?: ProjectionType<UserType>
    ): Promise<UserType | null> {
        return await this.UserModel.findOne({ email }, project);
    }

    async findTechnicalByPhone(
        phone: string , project?: ProjectionType<UserType>
    ): Promise<UserType | null>{
        return await this.UserModel.findOne({phone},project)
    }

    async findActiveTechnicals(
        filters: Filter<UserType>, project?: ProjectionType<UserType>
    ): Promise<UserType[]>{
        return await this.UserModel.find({...filters,isActive:true},project)
    }

    async findTechnicalsNearLocation(
        longitude: number, latitude: number , maxDistanceInMeters: number, filters?: Filter<UserType>
    ): Promise<UserType[]>{
        const locationFilter = {
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistanceInMeters
                }
            }
        };
        return await this.UserModel.find({...locationFilter,...filters});
    }

    // Check Methods

    async checkTechnicalExists(
        email: string,
        phone: string
    ): Promise<boolean>{
        const technical = await this.UserModel.exists({
            $or: [{ email }, { phone }],
        })
        return !!technical;
    }


    // Update methods

    async updateProfile(
        id: Types.ObjectId, updateData: Partial<UserType>
    ): Promise<UserType | null>{
        return await this.UserModel.findByIdAndUpdate(id, updateData , {new : true});
    }

    async updateManyTechnicals(
        filters: UpdateManyFilter<UserType>, updateQuery: UpdateQuery<UserType>
    ): Promise<number>{
        const result = await this.UserModel.updateMany(filters, updateQuery);
        return result.modifiedCount;
    }

    async updateTechnicalStatus(
        id: Types.ObjectId, isActive: boolean
    ): Promise<UserType | null>{
        return await this.UserModel.findByIdAndUpdate(id, {isActive}, {new : true});
    }

    async updateTechnicalLocation(
        id: Types.ObjectId, longitude: number, latitude: number
    ): Promise<UserType | null>{
        const location = {
            type: "Point",
            coordinates: [longitude, latitude]
        };
        return await this.UserModel.findByIdAndUpdate(id, {location}, {new : true});
    }   
}

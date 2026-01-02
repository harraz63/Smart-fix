import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ProjectionType, Types, UpdateQuery } from 'mongoose';
import { Technical,  TechnicalType } from '../Model/users/technical.model';

type Filter<T> = Parameters<Model<T>['find']>[0];
type UpdateManyFilter<T> = Parameters<Model<T>['updateMany']>[0];

@Injectable()
export class TechnicalRepository extends BaseRepository<TechnicalType>{
    constructor(
        @InjectModel(Technical.name) private readonly technicalModel: Model<TechnicalType>,
    ) {
        super(technicalModel);
    }   

    //Find methods

    async findOneDocument(
        filters: Filter<TechnicalType>,project?: ProjectionType<TechnicalType>
    ): Promise<TechnicalType | null> {
        return await this.technicalModel.findOne(filters,project);
    }

    async findTechnicalById(
        id: Types.ObjectId, project?: ProjectionType<TechnicalType>
    ): Promise<TechnicalType | null> {
        return await this.technicalModel.findById(id, project);
    }

    async findTechnicalByEmail(
        email: string, project?: ProjectionType<TechnicalType>
    ): Promise<TechnicalType | null> {
        return await this.technicalModel.findOne({ email }, project);
    }

    async findTechnicalByPhone(
        phone: string , project?: ProjectionType<TechnicalType>
    ): Promise<TechnicalType | null>{
        return await this.technicalModel.findOne({phone},project)
    }

    async findActiveTechnicals(
        filters: Filter<TechnicalType>, project?: ProjectionType<TechnicalType>
    ): Promise<TechnicalType[]>{
        return await this.technicalModel.find({...filters,isActive:true},project)
    }

    async findTechnicalsNearLocation(
        longitude: number, latitude: number , maxDistanceInMeters: number, filters?: Filter<TechnicalType>
    ): Promise<TechnicalType[]>{
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
        return await this.technicalModel.find({...locationFilter,...filters});
    }

    // Check Methods

    async checkTechnicalExists(
        email: string,
        phone: string
    ): Promise<boolean>{
        const technical = await this.technicalModel.exists({
            $or: [{ email }, { phone }],
        })
        return !!technical;
    }


    // Update methods

    async updateProfile(
        id: Types.ObjectId, updateData: Partial<TechnicalType>
    ): Promise<void> {
    await this.technicalModel.findByIdAndUpdate(id, updateData);
  }

    async updateManyTechnicals(
        filters: UpdateManyFilter<TechnicalType>, updateQuery: UpdateQuery<TechnicalType>
    ): Promise<void>{
        await this.technicalModel.updateMany(filters, updateQuery);
    }

    async updateTechnicalStatus(
        id: Types.ObjectId, isActive: boolean
    ): Promise<void>{
        await this.technicalModel.findByIdAndUpdate(id, {isActive}, {new : true});
    }

    async updateTechnicalLocation(
        id: Types.ObjectId, longitude: number, latitude: number
    ): Promise<void>{
        const location = {
            type: "Point",
            coordinates: [longitude, latitude]
        };
        await this.technicalModel.findByIdAndUpdate(id, {location}, {new : true});
    }   
}

import mongoose, {
  AnyObject,
  DeleteResult,
  HydratedDocument,
  Model,
  MongooseBaseQueryOptions,
  MongooseUpdateQueryOptions,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateResult,
} from 'mongoose';

type Filter<T> = Parameters<Model<T>['find']>[0];
type UpdateManyFilter<T> = Parameters<Model<T>['updateMany']>[0];

export class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  // CREATE
  async createDocument(document: Partial<T>): Promise<T> {
    return this.model.create(document);
  }

  // FIND MANY
  async findDocuments(
    filters: Filter<T>,
    project?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    return this.model.find(filters, project, options);
  }

  // FIND ONE
  async findOne(
    filters: Filter<T>,
    project?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findOne(filters, project, options);
  }

  // DELETE BY ID
  async deleteByIdDocument(
    id: mongoose.Types.ObjectId | string,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id);
  }

  // DELETE ONE
  async deleteOneDocument(
    filters: Filter<T>,
    options?: (MongooseBaseQueryOptions<T> & AnyObject) | null,
  ): Promise<DeleteResult> {
    return this.model.deleteOne(filters, options);
  }

  // DELETE MANY
  async deleteMultipleDocuments(
    filters: Filter<T>,
    options?: (MongooseBaseQueryOptions<T> & AnyObject) | null,
  ): Promise<DeleteResult> {
    return this.model.deleteMany(filters, options);
  }

  // UPDATE ONE
  async updateOneDocument(
    filters: Filter<T>,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOneAndUpdate(filters, update, options);
  }

  // UPDATE MANY
  async updateManyDocuments(
    filters: UpdateManyFilter<T>,
    update: UpdateQuery<T>,
    options?: MongooseUpdateQueryOptions<T>,
  ): Promise<UpdateResult> {
    return this.model.updateMany(filters, update, options);
  }

  // FIND BY ID AND UPDATE
  async findByIdAndUpdateDocument(
    id: mongoose.Types.ObjectId | string,
    update: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(id, update, options);
  }

  // FIND ONE AND DELETE
  async findAndDeleteDocument(
    filters: Filter<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOneAndDelete(filters, options);
  }

  // FIND BY ID AND DELETE
  async findByIdAndDeleteDocument(
    id: mongoose.Types.ObjectId | string,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id, options);
  }
}

import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL!, {
      dbName: process.env.DB_NAME,
    }),
  ],
  exports: [MongooseModule],
})
export class DataBaseModule {}

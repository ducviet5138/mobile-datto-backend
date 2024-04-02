// import { myDataSource } from '@/app-data-src';
// import { ObjectId } from 'mongodb';
// import { MongoRepository } from 'typeorm';
// import { Bucket } from '@/entities';

// class BucketService {
//     repository: MongoRepository<Bucket>;

//     constructor() {
//         this.repository = myDataSource.manager.getMongoRepository(Bucket);
//     }

//     async getBucketObject(id: ObjectId) {
//         try {
//             const data = await this.repository.findOneBy({ _id: id });
//             return data;
//         } catch (_: any) {
//             return null;
//         }
//     }
// }

// export default new BucketService();

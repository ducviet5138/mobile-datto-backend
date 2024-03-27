import { myDataSource } from '@/app-data-src';
import { ObjectId } from 'mongodb';
import { Bucket } from '@/entities';

class BucketService {
    repository: any;

    constructor() {
        this.repository = myDataSource.manager.getMongoRepository(Bucket);
    }

    async getBucketObject(id: ObjectId) {
        try {
            const data = await this.repository.findOne(id);
            return data;
        } catch (_: any) {
            return null;
        }
    }
}

export default new BucketService();

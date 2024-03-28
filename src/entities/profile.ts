import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';
import { Bucket } from './bucket';

@Entity()
export class Profile {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    fullName: string;

    @Column()
    dob: Date;

    @Column((type) => Bucket)
    avatar: Bucket;
}

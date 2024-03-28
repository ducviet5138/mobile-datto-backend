import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';
import { Event } from './event';
import { Bucket } from './bucket';

@Entity()
export class Memory {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column(() => Event)
    event: Event;

    @Column(() => Bucket)
    thumbnail: Bucket;

    @Column()
    info: string;
}

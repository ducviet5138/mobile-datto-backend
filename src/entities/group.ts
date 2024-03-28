import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';
import { Account } from './account';
import { Bucket } from './bucket';
import { Event } from './event';
import { Memory } from './memories';
import account from '@/services/account';

@Entity()
export class Group {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column((type) => Bucket)
    thumbnail: Bucket;

    @Column()
    inviteCode: string;

    @Column((type) => Account)
    members: Account[];

    @Column((type) => Event)
    events: Event[];

    @Column((type) => Memory)
    memories: Memory[];
}

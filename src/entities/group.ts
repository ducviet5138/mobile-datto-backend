import { Entity, ObjectId, ObjectIdColumn, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Account } from './account';
import { Bucket } from './bucket';
import { Event } from './event';
import { Memory } from './memories';

@Entity()
export class Group {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @OneToOne(() => Bucket)
    @JoinColumn()
    thumbnail: ObjectId;

    @Column()
    inviteCode: string;

    @OneToMany(() => Account, (account) => account._id)
    members: Account[];

    @OneToMany(() => Event, (event) => event._id)
    events: Event[];

    @OneToMany(() => Memory, (memory) => memory._id)
    memories: Memory[];
}

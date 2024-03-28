import { Entity, ObjectId, ObjectIdColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Bucket } from './bucket';
import { Group } from './group';

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

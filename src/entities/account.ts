import { Entity, ObjectId, ObjectIdColumn, Column, JoinColumn } from 'typeorm';
import { Profile } from './profile';

@Entity()
export class Account {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column(() => Profile)
    @JoinColumn()
    profile: ObjectId;
}

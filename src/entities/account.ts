import { Entity, ObjectId, ObjectIdColumn, Column, JoinColumn, OneToOne } from 'typeorm';
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

    @Column((type) => Profile)
    profile: Profile;
}

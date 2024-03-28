import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';
import { Account } from './account';

@Entity()
export class Calendar {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column(() => Account)
    createdBy: Account;

    @Column()
    time: object;
    // { start: Datetime, end: Datetime }
}

import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';
import { Account } from './account';

@Entity()
export class Fund {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column(() => Account)
    paidBy: Account;

    @Column()
    amount: number;

    @Column()
    info: string;

    @Column()
    paidAt: Date;
}

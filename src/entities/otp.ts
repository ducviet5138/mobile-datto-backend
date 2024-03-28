import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class OTP {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    code: number;

    @Column({ type: 'timestamp' })
    expiredAt: Date = new Date(Date.now() + 5 * 60 * 1000);
}

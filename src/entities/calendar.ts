import { Entity, ObjectId, ObjectIdColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { Account } from "./account"

@Entity()
export class Calendar {
    @ObjectIdColumn()
    _id: ObjectId

    @OneToOne(() => Account)
    @JoinColumn()
    createdBy: ObjectId

    @Column()
    time: Object
    // { start: Datetime, end: Datetime }
}
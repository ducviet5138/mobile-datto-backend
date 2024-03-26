import { Entity, ObjectId, ObjectIdColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { Account } from "./account"

@Entity()
export class Fund {
    @ObjectIdColumn()
    _id: ObjectId

    @OneToOne(() => Account)
    @JoinColumn()
    paidBy: ObjectId

    @Column()
    amount: number

    @Column()
    info: string

    @Column()
    paidAt: Date
}
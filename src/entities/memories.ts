import { Entity, ObjectId, ObjectIdColumn, Column, JoinColumn, OneToOne } from "typeorm"
import { Event } from "./event"
import { Bucket } from "./bucket"

@Entity()
export class Memory {
    @ObjectIdColumn()
    _id: ObjectId

    @OneToOne(() => Event)
    @JoinColumn()
    event: ObjectId

    @OneToOne(() => Bucket)
    @JoinColumn()
    thumbnail: ObjectId

    @Column()
    info: string
}
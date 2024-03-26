import { Timestamp } from "mongodb"
import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm"

@Entity()
export class Timeline {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    name: string

    @Column()
    location: Object

    @Column()
    startTime: Date

    @Column()
    duration: Timestamp
}
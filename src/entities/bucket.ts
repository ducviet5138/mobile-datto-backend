import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm"

@Entity()
export class Bucket {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    fileName: string
}
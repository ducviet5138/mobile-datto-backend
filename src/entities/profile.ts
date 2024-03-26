import { Entity, ObjectId, ObjectIdColumn, Column, JoinColumn, OneToOne, OneToMany } from "typeorm"
import { Bucket } from "./bucket"
import { Group } from "./group"

@Entity()
export class Profile {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    fullName: string

    @Column()
    dob: Date

    @OneToOne(() => Bucket)
    @JoinColumn()
    avatar: ObjectId

    @OneToMany(() => Group, group => group._id)
    groups: Group[]
}
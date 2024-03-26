import { Entity, ObjectId, ObjectIdColumn, Column, OneToMany } from "typeorm"
import { Calendar } from "./calendar"
import { Timeline } from "./timeline"
import { Fund } from "./fund"

@Entity()
export class Event {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    name: string

    @Column()
    time: Object
    // { start: Datetime, end: Datetime }

    @OneToMany(() => Calendar, calendar => calendar._id)
    calendars: Calendar[]

    @OneToMany(() => Timeline, timeline => timeline._id)
    timelines: Timeline[]

    @OneToMany(() => Fund, fund => fund._id)
    funds: Fund[]
    
    @Column()
    description: string
}
import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';
import { Calendar } from './calendar';
import { Timeline } from './timeline';
import { Fund } from './fund';

@Entity()
export class Event {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column()
    time: object;
    // { start: Datetime, end: Datetime }

    @Column((type) => Calendar)
    calendars: Calendar[];

    @Column((type) => Timeline)
    timelines: Timeline[];

    @Column((type) => Fund)
    funds: Fund[];

    @Column()
    description: string;
}

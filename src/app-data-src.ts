import { DataSource } from "typeorm"
import { 
    Account, 
    Bucket, 
    Calendar,
    Event,
    Fund,
    Group,
    Memory,
    Profile,
    Timeline
} from "./entities/"

export const myDataSource = new DataSource({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'datto',
    entities: [
        Account, 
        Bucket, 
        Calendar,
        Event,
        Fund,
        Group,
        Memory,
        Profile,
        Timeline
    ],
})
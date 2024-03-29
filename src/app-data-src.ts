// import { DataSource } from 'typeorm';
// import { Account, Bucket, Calendar, Event, Fund, Group, Memory, OTP, Profile, Timeline } from './entities/';

// export const myDataSource = new DataSource({
//     type: 'mongodb',
//     host: 'localhost',
//     port: 27017,
//     database: 'datto',
//     entities: [Account, Bucket, Calendar, Event, Fund, Group, Memory, OTP, Profile, Timeline],
// });

import mongoose from "mongoose";

export default async function databaseInitialize(){
    const uri = 'mongodb://localhost:27017/datto';
    console.log('[Database] Connecting to database...');
    try {
        await mongoose.connect(uri);
        console.log('[Database] Database has been initialized!');
    } catch (err: any) {
        console.error('[Database] Error: ', err);
    }
}
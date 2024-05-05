import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        time: {
            type: Object,
        },
        calendars: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Calendar',
            },
        ],
        timelines: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Timeline',
            },
        ],
        funds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Fund',
            },
        ],
        description: {
            type: String,
        },
        memory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Memory',
        },
    },
    {
        versionKey: false,
    }
);

export const Event = mongoose.model('Event', EventSchema, 'events');

import mongoose from 'mongoose';

const TimelineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        location: {
            type: Object,
        },
        start: {
            type: Date,
        },
        end: {
            type: Date,
        },
        description: {
            type: String,
        },
    },
    {
        versionKey: false,
    }
);

export const Timeline = mongoose.model('Timeline', TimelineSchema, 'timelines');

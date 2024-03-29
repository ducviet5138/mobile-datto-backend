import mongoose from "mongoose";

const TimelineSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    location: {
        type: Object,
    },
    startTime: {
        type: Date,
    },
    duration: {
        type: Date,
    }
}, {
    versionKey: false
});

export const Timeline = mongoose.model('Timeline', TimelineSchema, 'timelines');
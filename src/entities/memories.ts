import mongoose from 'mongoose';
const MemorySchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        },
        thumbnail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bucket',
        },
        info: {
            type: String,
        },
    },
    {
        versionKey: false,
    }
);

export const Memory = mongoose.model('Memory', MemorySchema, 'memories');

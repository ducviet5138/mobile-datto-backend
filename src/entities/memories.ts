import mongoose from 'mongoose';
const MemorySchema = new mongoose.Schema(
    {
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

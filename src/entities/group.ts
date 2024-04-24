import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        thumbnail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bucket',
        },
        inviteCode: {
            type: String,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Account',
            },
        ],
        events: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event',
            },
        ],
    },
    {
        versionKey: false,
    }
);

export const Group = mongoose.model('Group', GroupSchema, 'groups');

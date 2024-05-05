import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
        },
        googleId: {
            type: String,
            default: undefined,
        },
    },
    {
        versionKey: false,
    }
);

export const Account = mongoose.model('Account', AccountSchema, 'accounts');

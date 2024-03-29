import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },
        dob: {
            type: Date,
        },
        avatar: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bucket',
        },
    },
    {
        versionKey: false,
    }
);

export const Profile = mongoose.model('Profile', ProfileSchema, 'profiles');

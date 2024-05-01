import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const Notification = mongoose.model('Notification', NotificationSchema, 'notifications');

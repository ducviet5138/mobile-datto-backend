import mongoose from 'mongoose';

const CalendarSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
        },
        time: [
            {
                type: Date,
            },
        ],
    },
    {
        versionKey: false,
    }
);

export const Calendar = mongoose.model('Calendar', CalendarSchema, 'calendars');

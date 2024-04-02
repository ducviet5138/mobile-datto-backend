import mongoose from 'mongoose';

const FundSchema = new mongoose.Schema(
    {
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
        },
        amount: {
            type: Number,
        },
        info: {
            type: String,
        },
        paidAt: {
            type: Date,
        },
    },
    {
        versionKey: false,
    }
);

export const Fund = mongoose.model('Fund', FundSchema, 'funds');

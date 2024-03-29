import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    code: {
        type: Number,
    },
    expiredAt: {
        type: Date,
        default: () => new Date(Date.now() + 5 * 60 * 1000)
    }
}, {
    versionKey: false
});

export const OTP = mongoose.model('OTP', OTPSchema, 'otps');
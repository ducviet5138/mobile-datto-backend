import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    }
}, {
    versionKey: false
});

export const Account = mongoose.model('Account', AccountSchema, 'accounts');

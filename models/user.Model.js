import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true
    },
    aboutUser: {
        type: String,
        default: ""
    },
    dob: {
        type: Date
    },
    interests: {
        type: [String],
        default: []
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    expertise: {
        type: [String],
        default: []
    },
    userTitle: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const User = mongoose.model("User", userModel);

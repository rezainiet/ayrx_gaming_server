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
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }],
    // New fields for friend requests
    sentRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    receivedRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

export const User = mongoose.model("User", userModel);

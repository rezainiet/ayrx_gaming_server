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
    balance: {
        type: Number,
        default: 0
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
    }],
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    gotBlocked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    hourlyRate: {
        type: Number,
        default: 5,
        min: 5,
        max: 100
    },
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Projects'
        }
    ],
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ],
    bookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bookings'
        }
    ],
    buyerAppointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    sellerAppointments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }],
    forumPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ForumPost"
        }
    ],
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true });

export const User = mongoose.model("User", userModel);

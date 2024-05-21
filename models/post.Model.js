import mongoose from "mongoose";

const postModel = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    postContent: {
        type: String,
        required: true,
    },
    privacy: {
        type: String,
        enum: ['public', 'friends', 'onlyMe'],
        default: 'public',
    },
    imageUrl: {
        type: String,
        default: null,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export const Post = mongoose.model("Post", postModel);

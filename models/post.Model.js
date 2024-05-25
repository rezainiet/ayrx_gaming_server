import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
        // required: true,
        default: ""
    },
    profilePhoto: {
        type: String,
        // required: true,
        default: ""
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

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
    comments: [commentSchema]
}, { timestamps: true });

export const Post = mongoose.model("Post", postModel);

import mongoose from "mongoose";

const gameGroupPostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    image: {
        type: String,
        default: null
    }
}, { timestamps: true });

export const GameGroupPost = mongoose.model("GameGroupPost", gameGroupPostSchema);

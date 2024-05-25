import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    coverPhoto: {
        type: String,
        default: null,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    members: []
}, { timestamps: true });

export const Group = mongoose.model("Group", groupSchema);
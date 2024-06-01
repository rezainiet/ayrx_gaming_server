import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverPhoto: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const Projects = mongoose.model("Projects", projectSchema);

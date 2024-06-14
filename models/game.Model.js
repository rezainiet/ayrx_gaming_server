import mongoose from "mongoose";

const relatedGroupSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }
}, { _id: false });

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    coverPhoto: {
        type: String,
        default: null
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        trim: true
    },
    ratings: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    relatedGroups: [relatedGroupSchema] // Array of related groups
}, { timestamps: true });

export const Game = mongoose.model("Game", gameSchema);
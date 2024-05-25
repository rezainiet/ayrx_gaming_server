import mongoose from "mongoose";

// Define the schema for related groups
const relatedGroupSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }
}, { _id: false }); // Disable _id for subdocuments if not needed

// Define the schema for the game
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
        required: true,
        trim: true
    },
    ratings: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    relatedGroups: [relatedGroupSchema]
}, { timestamps: true });

export const Game = mongoose.model("Game", gameSchema);

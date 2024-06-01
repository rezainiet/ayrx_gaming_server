import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects'
    },
    status: {
        type: String,
        enum: ["pending", "completed", "canceled", "confirm"],
        default: "pending",
        required: true
    }
});

export const Bookings = mongoose.model('Bookings', bookingSchema)
import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ["pending", "completed", "canceled", "confirm"], // Corrected "confirm" to "confirmed"
        default: "pending",
        required: true
    },
    date: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    message: { type: String, default: '' }
}, {
    timestamps: true // Automatically create `createdAt` and `updatedAt` fields
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

export default Appointment;

// models/Withdrawal.js
// const mongoose = require('mongoose');
import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['PayPal', 'Bank'], required: true },
    paypalEmail: { type: String },
    bankDetails: { type: String },
    status: { type: String, enum: ['Pending', 'Completed', 'Rejected'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});


export const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
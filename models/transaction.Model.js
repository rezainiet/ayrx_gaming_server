import mongoose from "mongoose";

// Define the schema for the Transaction
const TransactionSchema = new mongoose.Schema({
    payment: {
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        method: { type: String, required: true }, // e.g., 'credit card', 'paypal', etc.
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        transactionDate: { type: Date, default: Date.now },
        referenceId: { type: String, unique: true, required: true }, // unique identifier for the transaction
        email: { type: String, required: true },
        paymentAddress: { type: String, required: true },
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects' },
        notes: { type: String, default: '' }
    },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    transactionType: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to a User model
    description: { type: String, required: true }, // Description of the transaction
}, {
    timestamps: true // Automatically create `createdAt` and `updatedAt` fields
});

// Create the model from the schema and export it
const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;

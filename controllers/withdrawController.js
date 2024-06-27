import { Withdrawal } from "../models/withdrawal.Model.js";
import { User } from "../models/user.Model.js"; // Assuming you have a User model to fetch user details

export const createWithdraw = async (req, res) => {
    const userId = req.id;
    const { amount, method, paypalEmail, bankDetails } = req.body;

    // Validation
    if (!userId || !amount || !method) {
        return res.status(400).send('Missing required fields');
    }
    if (method === 'PayPal' && !paypalEmail) {
        return res.status(400).send('PayPal email is required for PayPal withdrawals');
    }
    if (method === 'Bank' && !bankDetails) {
        return res.status(400).send('Bank details are required for bank withdrawals');
    }

    try {
        // Fetch the user's balance
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Validate the withdrawal amount
        if (amount > user.balance) {
            return res.status(400).send('Insufficient balance');
        }

        // Create a new withdrawal request
        const withdrawal = new Withdrawal({
            userId,
            amount,
            method,
            paypalEmail,
            bankDetails,
        });

        // Deduct the amount from user's balance
        user.balance -= amount;
        await user.save();

        // Save the withdrawal request
        await withdrawal.save();

        res.status(201).send(withdrawal);
    } catch (error) {
        res.status(500).send('Error creating withdrawal request');
    }
};


export const getPendingWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({ status: 'Pending' }).populate('userId', 'fullName email');
        res.status(200).send(withdrawals);
    } catch (error) {
        res.status(500).send('Error fetching pending withdrawals');
    }
};


export const approveWithdrawal = async (req, res) => {
    const { id } = req.params;
    try {
        const withdrawal = await Withdrawal.findByIdAndUpdate(id, { status: 'Approved' }, { new: true });
        if (!withdrawal) {
            return res.status(404).send('Withdrawal not found');
        }
        res.status(200).send(withdrawal);
    } catch (error) {
        res.status(500).send('Error approving withdrawal');
    }
};
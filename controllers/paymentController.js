import Stripe from "stripe";
import Transaction from "../models/transaction.Model.js";
import { User } from "../models/user.Model.js"; // Assuming the user model file is named user.Model.js
import { Projects } from "../models/projects.Model.js";
import { Bookings } from "../models/booking.Model.js";

const stripe = Stripe('sk_test_51PKmGjDYUg5iGXsD86oQUSGcVKnT607Vdbu7WhusiNwLuvot4EaPgJCS5BjysPrKdmAMhqsgx4Pgi2dU8FkzwYD200uuhrdOPE');


export const createPayment = async (req, res) => {
    const { amount, email, paymentAddress, productID } = req.body;

    try {
        // Create payment intent with additional options
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            },
            receipt_email: email,
            description: `Payment for ${amount / 100} USD`,
            metadata: { paymentAddress }
        });

        // Find the project and populate the author field
        const project = await Projects.findById(productID).populate('author');
        if (!project) {
            throw new Error("Project not found");
        }

        // Create a transaction record for the buyer (debit)
        const buyerTransaction = await Transaction.create({
            payment: {
                amount: amount / 100,
                currency: 'usd',
                method: 'stripe',
                status: 'completed',
                referenceId: `${paymentIntent.id}-${Date.now()}`, // Append a unique identifier
                transactionDate: new Date(),
                email,
                paymentAddress,
                productID
            },
            type: 'debit',
            transactionType: 'Package Purchase',
            userId: req.id,
            description: `Payment for ${amount / 100} USD`
        });

        // Create a transaction record for the seller (credit)
        // Adjust the amount based on your business logic
        const finalAmount = amount / 100 * 0.9; // Assuming 90% of the amount goes to the seller
        const sellerTransaction = await Transaction.create({
            payment: {
                amount: finalAmount,
                currency: 'usd',
                method: 'stripe',
                status: 'pending',
                referenceId: `${paymentIntent.id}-${Date.now()}`, // Append a unique identifier
                transactionDate: new Date(),
                email: email, // Use the seller's email
                paymentAddress: paymentAddress, // Use the seller's payment address
                productID
            },
            type: 'credit',
            transactionType: 'Package Sale',
            userId: project.author._id,
            description: `Sale for ${amount / 100} USD`
        });

        // Create a new booking
        const booking = await Bookings.create({
            buyer: req.id,
            seller: project.author._id,
            amount: amount / 100,
            product: project._id,
            status: 'pending' // Adjust as per your business logic
        });

        // Update the buyer's transactions array and bookings array
        const buyer = await User.findById(req.id);
        if (buyer) {
            buyer.transactions.push(buyerTransaction._id);
            buyer.bookings.push(booking._id); // Save the booking ID
            await buyer.save();
        }

        // Update the seller's transactions array and bookings array
        const seller = await User.findById(project.author._id);
        if (seller) {
            seller.transactions.push(sellerTransaction._id);
            seller.bookings.push(booking._id); // Save the booking ID
            await seller.save();
        }

        res.status(200).send({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(400).send({ success: false, error: error.message });
    }
};


export const getUserTransactions = async (req, res) => {
    try {
        const userId = req.id; // Assuming you have user authentication middleware that sets req.id
        const user = await User.findById(userId).populate('transactions');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.transactions.reverse());
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const sendTip = async (req, res) => {
    const { amount, paymentMethodId, notes, paymentAddress, email, authUserID } = req.body;
    const newAmount = amount / 100;
    console.log(paymentAddress, email);
    try {
        // Retrieve the payment method to ensure it exists
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

        if (!paymentMethod) {
            throw new Error("Payment method not found");
        }

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
            return_url: 'https://example.com/checkout/success' // Specify the return URL here
        });

        // Assuming tips go to a specific account or user
        const recipientId = "663e33f245723cab5637e1ca"; // Replace with the actual recipient ID
        const sender = await User.findById(authUserID);
        const recipient = await User.findById(recipientId);

        if (!recipient) {
            throw new Error('Recipient not found');
        }

        // Create a transaction record for the tip
        const tipTransaction = await Transaction.create({
            payment: {
                amount: newAmount,
                currency: 'usd',
                method: 'stripe',
                status: 'completed',
                referenceId: `${paymentIntent.id}-${Date.now()}`,
                transactionDate: new Date(),
                notes,
                paymentAddress, // Include paymentAddress
                email // Include email
            },
            type: 'credit',
            transactionType: 'Tip',
            userId: recipient._id,
            description: `Tip of ${amount / 100} USD`
        });
        const tipTransactionBuyer = await Transaction.create({
            payment: {
                amount: newAmount,
                currency: 'usd',
                method: 'stripe',
                status: 'completed',
                referenceId: `${paymentIntent.id}-${Date.now()}`,
                transactionDate: new Date(),
                notes,
                paymentAddress, // Include paymentAddress
                email // Include email
            },
            type: 'debit',
            transactionType: 'Tip',
            userId: recipient._id,
            description: `Tip of ${amount / 100} USD`
        });

        // Update the recipient's transactions array
        recipient.transactions.push(tipTransaction._id);
        sender.transactions.push(tipTransactionBuyer._id);
        recipient.balance = recipient.balance + newAmount;
        await sender.save();
        await recipient.save();

        res.status(200).send({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Tip error:', error);
        res.status(500).send({ success: false, error: error.message });
    }
};


export const createAppointmentPayment = async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
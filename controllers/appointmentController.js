import Appointment from "../models/appointment.Model.js";
import { User } from "../models/user.Model.js";
import moment from "moment";

const checkScheduleAvailability = async (date, startTime, endTime, seller) => {
    try {
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        console.log('Parsed start time:', start);
        console.log('Parsed end time:', end);

        const existingAppointments = await Appointment.find({
            seller: seller,
            date: date,
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });

        return existingAppointments.length === 0;
    } catch (error) {
        console.error('Error checking schedule availability:', error);
        throw new Error('Error checking schedule availability');
    }
};

export const createAppointment = async (req, res) => {
    try {
        const { buyer, seller, amount, status, date, startTime, endTime, message, clientSecret } = req.body;

        const isAvailable = await checkScheduleAvailability(date, startTime, endTime, seller);
        if (!isAvailable) {
            return res.status(400).json({ error: 'The selected time slot is already booked.' });
        }

        const start = moment(`${date}T${startTime}`).toDate();
        const end = moment(`${date}T${endTime}`).toDate();

        // get user from database
        const sender = await User.findById(buyer);
        const recipient = await User.findById(seller);

        // Create a transaction record for the tip
        const appointmentTransaction = await Transaction.create({
            payment: {
                amount: amount * 0.7,
                currency: 'usd',
                method: 'stripe',
                status: 'completed',
                referenceId: `${clientSecret}-${Date.now()}`,
                transactionDate: new Date(),
            },
            type: 'credit',
            transactionType: 'Appointment Booking',
            userId: recipient._id,
            description: message
        });
        const appointmentTransactionBuyer = await Transaction.create({
            payment: {
                amount: amount,
                currency: 'usd',
                method: 'stripe',
                status: 'completed',
                referenceId: `${clientSecret}-${Date.now()}`,
                transactionDate: new Date(),
            },
            type: 'debit',
            transactionType: 'Appointment Booking',
            userId: recipient._id,
            description: message
        });

        const appointment = new Appointment({
            buyer,
            seller,
            amount,
            status,
            date,
            startTime: start,
            endTime: end,
            message
        });

        const savedAppointment = await appointment.save();

        await User.findByIdAndUpdate(buyer, {
            $push: { buyerAppointments: savedAppointment._id }
        });
        await User.findByIdAndUpdate(seller, {
            $push: { sellerAppointments: savedAppointment._id }
        });

        // Update the recipient's transactions array
        recipient.transactions.push(appointmentTransaction._id);
        sender.transactions.push(appointmentTransactionBuyer._id);
        const newAmount = amount * 0.7;
        recipient.balance = recipient.balance + newAmount;
        await sender.save();
        await recipient.save();

        res.status(201).json({ message: 'Appointment booked successfully.', appointment: savedAppointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'An error occurred while booking the appointment.' });
    }
};

export const createFreeAppointment = async (req, res) => {
    try {
        const { buyer, seller, date, startTime, endTime, message } = req.body;

        const isAvailable = await checkScheduleAvailability(date, startTime, endTime, seller);
        if (!isAvailable) {
            return res.status(400).json({ error: 'The selected time slot is already booked.' });
        }

        const start = moment(`${date}T${startTime}`).toDate();
        const end = moment(`${date}T${endTime}`).toDate();

        // get user from database
        const sender = await User.findById(buyer);
        const recipient = await User.findById(seller);

        const appointment = new Appointment({
            buyer,
            seller,
            amount: 0,
            status: 'pending',
            date,
            startTime: start,
            endTime: end,
            message
        });

        const savedAppointment = await appointment.save();

        await User.findByIdAndUpdate(buyer, {
            $push: { buyerAppointments: savedAppointment._id }
        });
        await User.findByIdAndUpdate(seller, {
            $push: { sellerAppointments: savedAppointment._id }
        });

        await sender.save();
        await recipient.save();

        res.status(201).json({ message: 'Appointment booked successfully.', appointment: savedAppointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'An error occurred while booking the appointment.' });
    }
};

export const checkAvailability = async (req, res) => {
    try {
        const { date, startTime, endTime, seller } = req.body;
        console.log('Checking availability for:', { date, startTime, endTime, seller });
        const isAvailable = await checkScheduleAvailability(date, startTime, endTime, seller);
        res.status(200).json({ isAvailable });
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ error: 'An error occurred while checking schedule availability.' });
    }
};

export const getBookedAppointments = async (req, res) => {
    try {
        const { date, seller } = req.body;

        const appointments = await Appointment.find({
            seller: seller,
            date: date
        }).select('startTime endTime -_id');

        res.status(200).json({ appointments });
    } catch (error) {
        console.error('Error fetching booked appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching booked appointments.' });
    }
};

export const getUserAppointments = async (req, res) => {
    try {
        const { userId } = req.query;

        const appointments = await Appointment.find({
            $or: [{ buyer: userId }, { seller: userId }]
        }).populate('buyer', 'fullName profilePhoto _id')
            .populate('seller', 'fullName profilePhoto _id')
            .select('date startTime endTime message buyer seller');

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching user appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching user appointments.' });
    }
};


export const getPurchasedAppointments = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId)
        const appointments = await Appointment.find({
            buyer: userId
        }).populate('buyer', 'fullName profilePhoto _id')
            .populate('seller', 'fullName profilePhoto _id')  // Populate the seller field
            .select('date startTime endTime message buyer seller status');

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching purchased appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching your appointments.' });
    }
};
export const getReceivedAppointments = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId)
        const appointments = await Appointment.find({
            seller: userId
        }).populate('seller', 'fullName profilePhoto _id')
            .populate('buyer', 'fullName profilePhoto _id')  // Populate the seller field
            .select('date startTime endTime message buyer seller status');

        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching received appointments:', error);
        res.status(500).json({ error: 'An error occurred while fetching your appointments.' });
    }
};


export const cancelAppointment = async (req, res) => {
    const { appointmentId, userId } = req.params;

    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        // Check if the logged-in user (buyer) is authorized to cancel the appointment
        if (appointment.buyer.toString() !== userId) {

            return res.status(403).json({ error: 'You are not authorized to cancel this appointment.' });
        }

        // Update appointment status to "cancelled"
        appointment.status = 'cancelled';

        // Save the updated appointment
        const updatedAppointment = await appointment.save();

        res.status(200).json({ message: 'Appointment cancelled successfully.', appointment: updatedAppointment });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ error: 'An error occurred while cancelling the appointment.' });
    }
};
export const cancelAppointmentFromSeller = async (req, res) => {
    const { appointmentId, userId } = req.params;

    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        // Check if the logged-in user (buyer) is authorized to cancel the appointment
        if (appointment.seller.toString() !== userId) {

            return res.status(403).json({ error: 'You are not authorized to cancel this appointment.' });
        }

        // Update appointment status to "cancelled"
        appointment.status = 'cancelled';

        // Save the updated appointment
        const updatedAppointment = await appointment.save();
        console.log(updatedAppointment)

        res.status(200).json({ message: 'Appointment cancelled successfully.', appointment: updatedAppointment });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ error: 'An error occurred while cancelling the appointment.' });
    }
};


export const deleteAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    console.log(appointmentId)
    try {
        // Find the appointment by ID
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        // Remove the appointment from the database
        await Appointment.findByIdAndDelete(appointmentId);

        // Remove the appointment reference from the buyer's appointments array
        await User.findByIdAndUpdate(appointment.buyer, {
            $pull: { buyerAppointments: appointmentId }
        });

        // Remove the appointment reference from the seller's appointments array
        await User.findByIdAndUpdate(appointment.seller, {
            $pull: { sellerAppointments: appointmentId }
        });

        res.status(200).json({ message: 'Appointment deleted successfully.' });
    } catch (error) {
        console.error('Error while deleting appointment:', error);
        res.status(500).json({ error: 'An error occurred while deleting the appointment.' });
    }
};
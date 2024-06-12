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
        const { buyer, seller, amount, status, date, startTime, endTime, message } = req.body;

        const isAvailable = await checkScheduleAvailability(date, startTime, endTime, seller);
        if (!isAvailable) {
            return res.status(400).json({ error: 'The selected time slot is already booked.' });
        }

        const start = moment(`${date}T${startTime}`).toDate();
        const end = moment(`${date}T${endTime}`).toDate();

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

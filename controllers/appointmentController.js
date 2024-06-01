import Appointment from "../models/appointment.Model.js";
import { User } from "../models/user.Model.js";

const checkScheduleAvailability = async (date, startTime, endTime, seller) => {
    const start = new Date(date);
    start.setHours(new Date(startTime).getHours(), new Date(startTime).getMinutes());
    const end = new Date(date);
    end.setHours(new Date(endTime).getHours(), new Date(endTime).getMinutes());

    const existingAppointments = await Appointment.find({
        seller: seller,
        date: date,
        $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } }
        ]
    });

    return existingAppointments.length === 0;
};

export const createAppointment = async (req, res) => {
    try {
        const { buyer, seller, amount, status, date, startTime, endTime, message } = req.body;

        const isAvailable = await checkScheduleAvailability(date, startTime, endTime, seller);
        if (!isAvailable) {
            return res.status(400).json({ error: 'The selected time slot is already booked.' });
        }

        const appointment = new Appointment({
            buyer,
            seller,
            amount,
            status,
            date,
            startTime,
            endTime,
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
        res.status(500).json({ error: 'An error occurred while booking the appointment.' });
    }
};

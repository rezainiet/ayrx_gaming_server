import { Bookings } from "../models/booking.Model.js";
import { User } from "../models/user.Model.js";

export const getBookings = async (req, res) => {
    const userId = req.params.userId; // Get the user ID from request parameters
    try {
        // Fetch bookings for the user
        const buyerBookings = await Bookings.find({ buyer: userId }).populate('product');
        const sellerBookings = await Bookings.find({ seller: userId }).populate('product');
        res.status(200).json({ buyerBookings, sellerBookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const updateBooking = async (req, res) => {
    const bookingId = req.params.bookingId; // Get the booking ID from request parameters
    const { status } = req.body; // Get the new status from the request body

    try {
        // Find the booking by ID and update its status
        const updatedBooking = await Bookings.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true, runValidators: true }
        ).populate('product');

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const updateBookingConfirm = async (req, res) => {
    const bookingId = req.params.bookingId; // Get the booking ID from request parameters
    const { status, amount, author } = req.body; // Get the new status and amount from the request body

    try {
        // Find the booking by ID and update its status
        const updatedBooking = await Bookings.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true, runValidators: true }
        ).populate('product');

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Find the user by ID
        const user = await User.findById(author);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's balance
        user.balance = user.balance + amount;

        // Save the updated user information
        await user.save();

        res.status(200).json({ message: 'Booking updated and user balance updated successfully', updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
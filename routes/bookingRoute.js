import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getBookings, updateBooking, updateBookingConfirm } from "../controllers/bookingController.js";

const router = express.Router();

// http://localhost:4000//api/v1/booking/getBookings/:userId
router.route('/getBookings/:userId').get(isAuthenticated, getBookings)
router.route('/updateBooking/:bookingId').put(isAuthenticated, updateBooking)
router.route('/updateBookingConfirm/:bookingId').put(isAuthenticated, updateBookingConfirm)

export default router;
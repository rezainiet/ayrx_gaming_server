import express from 'express';
import { createAppointment, checkAvailability, getBookedAppointments, getUserAppointments } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/createAppointment', createAppointment);
router.post('/checkAvailability', checkAvailability);
router.post('/getBookedAppointments', getBookedAppointments);
router.get('/getUserAppointments', getUserAppointments); // New route for fetching user appointments

export default router;

import express from 'express';
import { createAppointment, checkAvailability, getBookedAppointments } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/createAppointment', createAppointment);
router.post('/checkAvailability', checkAvailability);
router.post('/getBookedAppointments', getBookedAppointments);

export default router;

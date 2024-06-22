import express from 'express';
import { createAppointment, createFreeAppointment, checkAvailability, getBookedAppointments, getUserAppointments, getPurchasedAppointments, cancelAppointment, getReceivedAppointments, cancelAppointmentFromSeller, deleteAppointment } from '../controllers/appointmentController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/createAppointment', isAuthenticated, createAppointment);
router.post('/createFreeAppointment', createFreeAppointment); // New endpoint for free appointments
router.post('/checkAvailability', checkAvailability);
router.post('/getBookedAppointments', getBookedAppointments);
router.get('/getUserAppointments', getUserAppointments);
router.get('/getPurchasedAppointments/:userId', isAuthenticated, getPurchasedAppointments);
router.get('/getReceivedAppointments/:userId', isAuthenticated, getReceivedAppointments);
router.put('/cancelAppointment/:appointmentId/:userId', isAuthenticated, cancelAppointment);
router.put('/cancelAppointmentFromSeller/:appointmentId/:userId', isAuthenticated, cancelAppointmentFromSeller);
router.delete('/deleteAppointment/:appointmentId/:userId', isAuthenticated, deleteAppointment);

export default router;

import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createAppointment, checkAvailability } from "../controllers/appointmentController.js";

const router = express.Router();

// https://www.api.onlyhumanity.co.uk/api/v1/appointment/*
router.route('/createAppointment').post(isAuthenticated, createAppointment);
router.route('/checkAvailability').post(isAuthenticated, checkAvailability);

export default router;

import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

// http://localhost:4000/api/v1/appointment/*
router.route('/createAppointment').post(isAuthenticated, createAppointment)

export default router;
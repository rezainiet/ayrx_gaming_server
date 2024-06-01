import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { createPayment, getUserTransactions, sendTip } from '../controllers/paymentController.js';

const router = express.Router();

// http://localhost:4000/api/v1/payment/payment_intent
router.route("/payment_intent").post(isAuthenticated, createPayment);

// http://localhost:4000/api/v1/payment/send-tip
router.route("/send-tip").post(isAuthenticated, sendTip);

// http://localhost:4000/api/v1/payment/transactions
router.route("/transactions").get(isAuthenticated, getUserTransactions);



export default router;
import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { approveWithdrawal, createWithdraw, getPendingWithdrawals } from '../controllers/withdrawController.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();
router.post('/createWithdraw', isAuthenticated, createWithdraw);
router.get('/getPendingWithdrawals', isAuthenticated, isAdmin, getPendingWithdrawals);
router.put('/approveWithdrawal/:id', isAuthenticated, isAdmin, approveWithdrawal);

export default router;
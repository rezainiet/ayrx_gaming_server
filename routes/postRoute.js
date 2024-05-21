import express from 'express';
import { createPost } from '../controllers/postController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/createPost").post(isAuthenticated, createPost);

export default router;

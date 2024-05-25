import express from 'express';
import { createComment, createPost, getPosts } from '../controllers/postController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route("/createPost").post(isAuthenticated, createPost);
router.route("/getPosts/:id").get(isAuthenticated, getPosts);
router.route("/:postId/createComment").put(isAuthenticated, createComment);

export default router;

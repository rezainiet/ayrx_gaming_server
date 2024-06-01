import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createComment, createCommentByPostId, getCommentsByPostId } from "../controllers/forumCommentController.js";

const router = express.Router();

// Create a new forum comment
// router.route('/createComment').post(createComment)
router.route('/:postId/comments').get(getCommentsByPostId);
router.route('/:postId/comments').post(createCommentByPostId);

export default router;

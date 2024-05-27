import express from 'express';
import { createComment, createPost, createPostInGroup, getPosts } from '../controllers/postController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { likePost } from '../controllers/likeController.js';

const router = express.Router();

router.route("/createPost").post(isAuthenticated, createPost);
router.route("/getPosts/:id").get(isAuthenticated, getPosts);
router.route("/:postId/createComment").put(isAuthenticated, createComment);
router.route("/:groupId/createPostInGroup").post(isAuthenticated, createPostInGroup);
router.route("/:postId/like").post(isAuthenticated, likePost);
// http://localhost:4000/api/v1/posts/postId/like



export default router;

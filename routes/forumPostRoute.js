import express from 'express';
import { createForumPost, getForumPostById, getForumPosts, likeForumPost, removeLike } from '../controllers/forumPostController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// Create a new forum post
router.route('/createPost').post(isAuthenticated, createForumPost)
// Get all forum posts
router.route('/getPost').get(getForumPosts)
// Get forum post by ID
router.route('/getPost/:id').get(getForumPostById)
router.route('/:postId/like').post(likeForumPost)
router.route('/:postId/like/:userId').delete(removeLike)

export default router;
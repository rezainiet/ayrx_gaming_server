import express from 'express';
import { createForumPost, getForumPostById, getForumPosts, likeForumPost, removeLike, updateForumPost, deleteForumPost } from '../controllers/forumPostController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

// Create a new forum post
router.route('/createPost').post(isAuthenticated, createForumPost);
// Get all forum posts
router.route('/getPost').get(getForumPosts);
// Get forum post by ID
router.route('/getPost/:id').get(getForumPostById);
// Like a forum post
router.route('/:postId/like').post(likeForumPost);
// Remove like from a forum post
router.route('/:postId/like/:userId').delete(removeLike);
// Update a forum post
router.route('/updatePost/:id').put(isAuthenticated, updateForumPost);
// Delete a forum post
router.route('/deletePost/:id').delete(isAuthenticated, deleteForumPost);

export default router;

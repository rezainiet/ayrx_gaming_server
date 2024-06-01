import express from "express";
import { createForumReply } from "../controllers/forumReplyController.js";

const router = express.Router();

// Create a new forum reply
router.route('/createReply').post(createForumReply)

// Get all forum replies
router.get('/', async (req, res) => {
    try {
        const forumReplies = await ForumReply.find().populate('user');
        res.json(forumReplies);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get forum reply by ID
router.get('/:id', async (req, res) => {
    try {
        const forumReply = await ForumReply.findById(req.params.id).populate('user');
        if (!forumReply) return res.status(404).json({ error: 'Forum reply not found' });
        res.json(forumReply);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
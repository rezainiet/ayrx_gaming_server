import ForumPost from "../models/forumPost.Model.js";
import { User } from "../models/user.Model.js";

// Create a new forum post
export const createForumPost = async (req, res) => {
    try {
        const { title, content, imageUrl, user } = req.body; // Extract title, content, and image from request body
        const forumPost = new ForumPost({ title, content, image: imageUrl, user }); // Create new ForumPost object
        const getUser = await User.findById(user);
        getUser.forumPosts.push(forumPost._id);
        await getUser.save();
        await forumPost.save(); // Save the forum post
        res.status(201).json({ forumPost, success: true }); // Send response with created forum post
    } catch (error) {
        res.status(400).json({ error: error.message }); // Send error response if there's an error
    }
};

// Get all forum posts
export const getForumPosts = async (req, res) => {
    try {
        const forumPosts = await ForumPost.find()
            .populate({
                path: 'user',
                select: '_id fullName profilePhoto'
            }) // Populating the user who created the post
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: '_id fullName profilePhoto' // Populating the user information for each comment
                }
            });

        res.json(forumPosts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get forum post by ID
export const getForumPostById = async (req, res) => {
    try {
        const forumPost = await ForumPost.findById(req.params.id)
            .populate({
                path: 'user',
                select: '_id fullName profilePhoto'
            }) // Populating the user who created the post
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: '_id fullName profilePhoto' // Populating the user information for each comment
                }
            });

        if (!forumPost) {
            return res.status(404).json({ error: 'Forum post not found' });
        }

        res.json(forumPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Like a forum post
export const likeForumPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.body.userId;

        const updatedPost = await ForumPost.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });

        res.json(updatedPost);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
};

// Remove like from a forum post
export const removeLike = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.params.userId;

        const updatedPost = await ForumPost.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });

        res.json(updatedPost);
    } catch (error) {
        console.error('Error removing like:', error);
        res.status(500).json({ error: 'Failed to remove like' });
    }
};

// Update a forum post
export const updateForumPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const updates = req.body;

        const updatedPost = await ForumPost.findByIdAndUpdate(postId, updates, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ error: 'Forum post not found' });
        }

        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a forum post
export const deleteForumPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await ForumPost.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ error: 'Forum post not found' });
        }

        // Also remove the post from the user's forumPosts array
        await User.findByIdAndUpdate(deletedPost.user, { $pull: { forumPosts: postId } });

        res.json({ message: 'Forum post deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

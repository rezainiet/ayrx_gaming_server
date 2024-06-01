import ForumComment from "../models/forumComment.Model.js";
import ForumPost from "../models/forumPost.Model.js";

export const createComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { content, user } = req.body;

        // Create a new comment
        const newComment = new ForumComment({
            post: postId,
            user,
            content
        });

        const post = await ForumPost.findById(postId);
        post.comments.push(newComment._id);

        await post.save();

        // Save the comment to the database
        await newComment.save();

        // Fetch updated comments for the forum post
        const updatedComments = await ForumComment.find({ post: postId }).populate({
            path: 'user',
            select: '_id fullName profilePhoto'
        });

        res.json({ comments: updatedComments }); // Send back the updated comments
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
};

export const getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Ensure 'postId' is the correct field name in the ForumComment model
        const comments = await ForumComment.find({ post: postId }).populate({
            path: 'user',
            select: '_id fullName profilePhoto'
        });

        res.json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments.' });
    }
};


export const createCommentByPostId = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { content, user } = req.body;

        // Create a new comment
        const newComment = new ForumComment({
            post: postId,
            user,
            content
        });

        const post = await ForumPost.findById(postId);
        post.comments.push(newComment._id);

        await post.save();

        // Save the comment to the database
        await newComment.save();

        // Fetch updated comments for the forum post
        const updatedComments = await ForumComment.find({ postId }); // Assuming postId is stored in the Comment model
        res.json({ comments: updatedComments });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
}